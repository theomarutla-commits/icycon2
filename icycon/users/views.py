from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash, get_user_model
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from rest_framework import viewsets, permissions, status, generics, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserProfileSerializer, ChangePasswordSerializer, OrganizationMembershipSerializer
from .forms import UserProfileForm
from .models import OrganizationMembership

User = get_user_model()

# Frontend views
@login_required
def profile_dashboard(request):
    """Combined profile and account dashboard."""
    user = request.user
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('profile_dashboard')
    else:
        form = UserProfileForm(instance=user)

    # Get some basic activities (we'll expand this later)
    activities = []  # In the future, we can add actual activity tracking
    
    return render(request, 'users/dashboard.html', {
        'form': form,
        'user': user,
        'activities': activities
    })

# API views
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own profile."""
        return User.objects.filter(id=self.request.user.id)
    
    def get_object(self):
        """Override to ensure users can only access their own profile."""
        return self.request.user

    @action(detail=True, methods=['post'])
    def change_password(self, request):
        """Change user password endpoint."""
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            if not user.check_password(serializer.data.get('old_password')):
                return Response({'error': 'Wrong old password.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.data.get('new_password'))
            user.save()
            update_session_auth_hash(request, user)  # Keep user logged in
            return Response({'message': 'Password updated successfully.'})
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True)
    def organizations(self, request):
        """Get all organization memberships for the current user."""
        user = self.get_object()
        memberships = user.memberships.all()
        serializer = OrganizationMembershipSerializer(memberships, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def join_organization(self, request):
        """Join an organization (requires invitation)."""
        user = self.get_object()
        organization_id = request.data.get('organization')
        organization = get_object_or_404(User, id=organization_id, organization_name__isnull=False)
        
        # Check if already a member
        if user.memberships.filter(organization=organization).exists():
            return Response(
                {"error": "Already a member of this organization"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create membership (viewer role by default)
        OrganizationMembership.objects.create(
            member=user,
            organization=organization,
            role="viewer"
        )
        
        return Response({"message": "Successfully joined organization"})

    @action(detail=True)
    def activity(self, request):
        """Get user's recent activity across all apps."""
        user = self.get_object()
        # Add activity tracking here when implemented
        return Response({
            'message': 'Activity tracking will be implemented in future release.'
        })

    @action(detail=True, methods=['post'], url_path='avatar')
    def avatar(self, request):
        """Upload avatar image and set user's avatar_url."""
        user = self.get_object()
        if 'avatar' not in request.FILES:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        avatar_file = request.FILES['avatar']
        from django.core.files.storage import default_storage
        from django.utils import timezone
        # Build a simple path under media/avatars/{user_id}_{timestamp}_{filename}
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
        filename = f'avatars/user_{user.id}_{timestamp}_{avatar_file.name}'
        saved_path = default_storage.save(filename, avatar_file)
        # Construct public URL (depends on storage backend)
        try:
            url = default_storage.url(saved_path)
        except Exception:
            # Fallback to MEDIA_URL
            from django.conf import settings
            url = f"{getattr(settings, 'MEDIA_URL', '/media/')}{saved_path}"

        user.avatar_url = url
        user.save()
        return Response({'avatar_url': url})


class OrganizationMembershipViewSet(viewsets.ModelViewSet):
    """Manage organization memberships via API."""
    serializer_class = OrganizationMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Staff see everything
        if user.is_staff:
            return OrganizationMembership.objects.all()

        # If user is an organization (represents an org) and is owner/admin, show org members
        if getattr(user, 'organization_name', None) and getattr(user, 'organization_role', None) in ['owner', 'admin']:
            return user.member_memberships.all()

        # Otherwise, show memberships where the user is a member
        return user.memberships.all()

    def perform_create(self, serializer):
        org = serializer.validated_data.get('organization')
        if not getattr(org, 'organization_name', None):
            raise serializers.ValidationError({"organization": "Selected user is not an organization"})
        serializer.save()


# Server-rendered organization UI views
@login_required
def organization_index(request):
    """Show organizations related to the current user."""
    user = request.user
    # If user is an organization (represents an org), show its page
    if getattr(user, 'organization_name', None):
        orgs = [user]
    else:
        # Show organizations the user is a member of
        orgs = [m.organization for m in user.memberships.select_related('organization').all()]

    return render(request, 'users/organization_index.html', {'orgs': orgs})


@login_required
def organization_detail(request, org_id):
    """Details for a single organization"""
    org = get_object_or_404(User, id=org_id, organization_name__isnull=False)
    # Basic permission: user must be a member or the organization itself or staff
    if not (request.user.is_staff or request.user == org or request.user.memberships.filter(organization=org).exists()):
        messages.error(request, 'You do not have access to that organization.')
        return redirect('profile_dashboard')

    members = OrganizationMembership.objects.filter(organization=org).select_related('member')
    return render(request, 'users/organization_detail.html', {'org': org, 'members': members})


@login_required
def organization_members(request, org_id):
    """List members of a specific organization (server-rendered)"""
    org = get_object_or_404(User, id=org_id, organization_name__isnull=False)
    # Only organization owners/admins or staff can view/manage members
    allowed = request.user.is_staff or request.user == org or getattr(request.user, 'organization_role', None) in ['owner', 'admin'] or request.user.memberships.filter(organization=org).exists()
    if not allowed:
        messages.error(request, 'You do not have access to view members for this organization.')
        return redirect('profile_dashboard')

    memberships = OrganizationMembership.objects.filter(organization=org).select_related('member')
    return render(request, 'users/organization_members.html', {'org': org, 'memberships': memberships})


@login_required
def organization_members_list(request):
    """Fallback members list (global) - redirect to user's first org if available"""
    user = request.user
    if getattr(user, 'organization_name', None):
        return redirect('organization_members', org_id=user.id)
    membership = user.memberships.first()
    if membership:
        return redirect('organization_members', org_id=membership.organization.id)
    messages.info(request, 'You are not a member of any organization yet.')
    return redirect('profile_dashboard')


@login_required
def organization_settings(request, org_id):
    org = get_object_or_404(User, id=org_id, organization_name__isnull=False)
    # Only owners/admins or the organization itself can access settings
    if not (request.user.is_staff or request.user == org or request.user.memberships.filter(organization=org, role__in=['owner','admin']).exists()):
        messages.error(request, 'You do not have access to organization settings.')
        return redirect('profile_dashboard')

    # Placeholder: settings UI not implemented yet
    return render(request, 'users/organization_settings.html', {'org': org})


@login_required
def organization_settings_global(request):
    # Redirect to specific org settings if user is org or member
    user = request.user
    if getattr(user, 'organization_name', None):
        return redirect('organization_settings', org_id=user.id)
    membership = user.memberships.filter(role__in=['owner','admin']).first()
    if membership:
        return redirect('organization_settings', org_id=membership.organization.id)
    messages.info(request, 'No organization settings accessible.')
    return redirect('profile_dashboard')