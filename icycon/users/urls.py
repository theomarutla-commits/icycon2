from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .auth_views import SignupView, LoginView

router = DefaultRouter()
router.register(r'profile', views.UserProfileViewSet, basename='profile')
router.register(r'memberships', views.OrganizationMembershipViewSet, basename='membership')

urlpatterns = [
    # Authentication API endpoints
    path('api/auth/signup', SignupView.as_view(), name='signup'),
    path('api/auth/login', LoginView.as_view(), name='login'),
    
    # API endpoints
    path('api/', include(router.urls)),
    
    # Server-rendered views
    path('', views.profile_dashboard, name='profile_dashboard'),

    # Organization UI (server-rendered)
    path('organization/', views.organization_index, name='organization_index'),
    path('organization/members/', views.organization_members_list, name='organization_members_global'),
    path('organization/settings/', views.organization_settings_global, name='organization_settings_global'),

    # Organization-specific (with id)
    path('organization/<int:org_id>/', views.organization_detail, name='organization_detail'),
    path('organization/<int:org_id>/members/', views.organization_members, name='organization_members'),
    path('organization/<int:org_id>/settings/', views.organization_settings, name='organization_settings'),
]