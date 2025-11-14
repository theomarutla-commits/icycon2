"""
API views for serving SPA-compatible data to the React frontend.
These replace the server-rendered TemplateViews.
"""

from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from analytics.models import Site as AnalyticsSite, KeywordCluster as AnalyticsKeywordCluster, ContentItem as AnalyticsContentItem, FAQ as AnalyticsFAQ, PageView
from aso.models import App as ASOApp, AppKeyword, AppListing
from marketplace.models import (
    Product, Review, Order, SavedProduct,
    Conversation as MarketplaceConversation,
    Message as MarketplaceMessage
)
from tenants.models import Tenant, TenantUser
from seo.models import Site as SEOSite, KeywordCluster as SEOKeywordCluster, ContentItem as SEOContentItem, FAQ as SEOFAQ
from social_media.models import (
    SocialAccount, Post, Comment, Engagement,
    Conversation as SocialConversation,
    Message as SocialMessage
)
from email_engine.models import EmailList, Contact, EmailTemplate, EmailFlow, EmailSend


# ============================================================================
# Helper Functions
# ============================================================================

def get_user_tenants(user):
    """Get all tenants the user has access to."""
    return Tenant.objects.filter(tenantuser__user=user)


# ============================================================================
# Dashboard API
# ============================================================================

class DashboardView(generics.GenericAPIView):
    """
    Get user dashboard data with overview of all apps and services.
    GET /api/dashboard/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Gather dashboard summary data
        dashboard_data = {
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            "aso_apps_count": ASOApp.objects.filter(tenant__user=user).count(),
            "marketplace_products_count": Product.objects.filter(tenant__user=user).count(),
            "recent_activities": []
        }
        
        return Response(dashboard_data)


# ============================================================================
# ASO (App Store Optimization) APIs
# ============================================================================

class ASOAppViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ASO apps. Replaces aso-ui template.
    GET /api/aso/apps/
    POST /api/aso/apps/
    GET /api/aso/apps/{id}/
    """
    serializer_class = None  # Will define inline
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return ASOApp.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        apps = self.get_queryset()
        data = []
        for app in apps:
            data.append({
                "id": app.id,
                "name": app.name,
                "platform": app.get_platform_display(),
                "bundle_id": app.bundle_id,
                "rating": app.rating,
                "reviews_count": app.reviews_count,
                "downloads_count": app.downloads_count,
                "category": app.category,
                "icon_url": app.icon_url,
                "status": app.status,
                "keywords_count": app.keywords.count(),
            })
        return Response(data)

    def retrieve(self, request, pk=None):
        app = get_object_or_404(self.get_queryset(), pk=pk)
        keywords = app.keywords.all()
        listings = app.listings.all()
        
        return Response({
            "id": app.id,
            "name": app.name,
            "bundle_id": app.bundle_id,
            "platform": app.get_platform_display(),
            "rating": app.rating,
            "reviews_count": app.reviews_count,
            "downloads_count": app.downloads_count,
            "description": app.description,
            "category": app.category,
            "icon_url": app.icon_url,
            "status": app.status,
            "keywords": [
                {"id": k.id, "keyword": k.keyword, "position": k.position, "search_volume": k.search_volume}
                for k in keywords
            ],
            "listings": [
                {"id": l.id, "locale": l.locale, "title": l.title}
                for l in listings
            ]
        })


# ============================================================================
# Marketplace APIs
# ============================================================================

class MarketplaceProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for marketplace products. Replaces marketplace-ui template.
    GET /api/marketplace/products/
    POST /api/marketplace/products/
    GET /api/marketplace/products/{id}/
    """
    serializer_class = None  # Will use inline
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return Product.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        products = self.get_queryset()
        data = []
        for product in products:
            data.append({
                "id": product.id,
                "title": product.title,
                "category": product.get_category_display(),
                "status": product.status,
                "price": float(product.price) if product.price else 0,
                "pricing_type": product.get_pricing_type_display(),
                "featured_image": product.featured_image,
                "rating": float(product.rating),
                "review_count": product.review_count,
                "created_at": product.created_at.isoformat(),
            })
        return Response(data)

    def retrieve(self, request, pk=None):
        product = get_object_or_404(self.get_queryset(), pk=pk)
        reviews = product.reviews.all()
        
        return Response({
            "id": product.id,
            "title": product.title,
            "description": product.description,
            "category": product.get_category_display(),
            "status": product.status,
            "price": float(product.price) if product.price else 0,
            "pricing_type": product.get_pricing_type_display(),
            "featured_image": product.featured_image,
            "images": product.images,
            "features": product.features,
            "tags": product.tags,
            "rating": float(product.rating),
            "review_count": product.review_count,
            "reviews": [
                {
                    "id": r.id,
                    "rating": r.rating,
                    "title": r.title,
                    "comment": r.comment,
                    "reviewer": r.reviewer.username,
                    "created_at": r.created_at.isoformat(),
                }
                for r in reviews
            ],
            "created_at": product.created_at.isoformat(),
        })


# ============================================================================
# Analytics/SEO APIs
# ============================================================================

class AnalyticsSitesViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for analytics sites. Replaces analytics-ui template.
    GET /api/analytics/sites/
    GET /api/analytics/sites/{id}/
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return AnalyticsSite.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        sites = self.get_queryset()
        data = []
        for site in sites:
            data.append({
                "id": site.id,
                "domain": site.domain,
                "default_locale": site.default_locale,
                "created_at": site.created_at.isoformat(),
                "pageview_count": site.pageview_set.count(),
            })
        return Response(data)

    def retrieve(self, request, pk=None):
        site = get_object_or_404(self.get_queryset(), pk=pk)
        pageviews = site.pageview_set.all()[:50]  # Last 50 pageviews
        
        return Response({
            "id": site.id,
            "domain": site.domain,
            "default_locale": site.default_locale,
            "sitemaps_url": site.sitemaps_url,
            "robots_txt": site.robots_txt,
            "created_at": site.created_at.isoformat(),
            "pageviews_count": site.pageview_set.count(),
            "recent_pageviews": [
                {
                    "url": pv.url,
                    "timestamp": pv.timestamp.isoformat(),
                    "duration": pv.duration,
                    "bounce": pv.bounce,
                }
                for pv in pageviews
            ]
        })


# ============================================================================
# Multilingual APIs
# ============================================================================

class MultilingualSummaryView(generics.GenericAPIView):
    """
    Get multilingual summary data. Replaces multilingual-ui template.
    GET /api/multilingual/summary/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        tenants = get_user_tenants(user)
        
        # Count locales across all content
        content_items = ContentItem.objects.filter(tenant__in=tenants)
        locales = set(content_items.values_list('locale', flat=True))
        
        return Response({
            "locales": list(locales),
            "content_count": content_items.count(),
            "content_by_type": {
                "blog": content_items.filter(type="blog").count(),
                "faq": content_items.filter(type="faq").count(),
                "qapage": content_items.filter(type="qapage").count(),
                "product": content_items.filter(type="product").count(),
            }
        })


# ============================================================================
# Tenants APIs
# ============================================================================

class TenantSummaryView(generics.GenericAPIView):
    """
    Get tenant information and memberships. Replaces tenants-ui template.
    GET /api/tenants/summary/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        tenants = get_user_tenants(user)
        
        return Response({
            "tenants": [
                {
                    "id": t.id,
                    "name": t.name,
                    "slug": t.slug,
                    "created_at": t.created_at.isoformat() if hasattr(t, 'created_at') else None,
                }
                for t in tenants
            ],
            "tenant_count": tenants.count(),
        })


class TenantMembersView(generics.GenericAPIView):
    """
    Get tenant members. Replaces tenants-tenant-users template.
    GET /api/tenants/{tenant_id}/members/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, tenant_id=None, *args, **kwargs):
        user = request.user
        tenant = get_object_or_404(Tenant, id=tenant_id, user=user)
        
        # Get members (users with access to this tenant)
        members = [user]  # For now, just return the owner
        
        return Response({
            "tenant_id": tenant.id,
            "tenant_name": tenant.name,
            "members": [
                {
                    "id": m.id,
                    "username": m.username,
                    "email": m.email,
                }
                for m in members
            ]
        })


# ============================================================================
# SEO APIs
# ============================================================================

class SEOSitesViewSet(viewsets.ModelViewSet):
    """ViewSet for SEO sites."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return SEOSite.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        sites = self.get_queryset()
        return Response([{
            "id": s.id,
            "domain": s.domain,
            "sitemaps_url": s.sitemaps_url,
            "default_locale": s.default_locale,
            "domain_authority": 0,  # Will be fetched from external API
            "backlink_count": s.backlinks.count() if hasattr(s, 'backlinks') else 0,
            "indexed_pages": 0,  # Will be fetched from external API
            "last_crawled": s.created_at.isoformat() if s.created_at else None,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        } for s in sites])

    def retrieve(self, request, pk=None):
        site = get_object_or_404(self.get_queryset(), pk=pk)
        return Response({
            "id": site.id,
            "domain": site.domain,
            "sitemaps_url": site.sitemaps_url,
            "default_locale": site.default_locale,
            "robots_txt": site.robots_txt,
            "domain_authority": 0,
            "backlink_count": site.backlinks.count() if hasattr(site, 'backlinks') else 0,
            "indexed_pages": 0,
        })


class SEOKeywordClustersViewSet(viewsets.ModelViewSet):
    """ViewSet for SEO keyword clusters."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return SEOKeywordCluster.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        clusters = self.get_queryset()
        return Response([{
            "id": c.id,
            "keyword": c.terms[0] if c.terms else c.intent,
            "intent": c.intent,
            "locale": c.locale,
            "search_volume": 0,  # Will be populated
            "difficulty": "Medium",  # Will be populated
            "ranking": 0,  # Will be populated
            "traffic_value": 0,  # Will be populated
            "created_at": c.created_at.isoformat() if c.created_at else None,
        } for c in clusters])


class SEOContentItemsViewSet(viewsets.ModelViewSet):
    """ViewSet for SEO content items."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return SEOContentItem.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        items = self.get_queryset()
        return Response([{
            "id": i.id,
            "type": i.type,
            "url": i.url,
            "status": i.status,
            "locale": i.locale,
            "created_at": i.created_at.isoformat() if i.created_at else None,
        } for i in items])


class SEOFAQsViewSet(viewsets.ModelViewSet):
    """ViewSet for SEO FAQs."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return SEOFAQ.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        faqs = self.get_queryset()
        return Response([{
            "id": f.id,
            "question": f.question,
            "answer": f.answer[:200] + "..." if len(f.answer) > 200 else f.answer,
            "created_at": f.created_at.isoformat() if f.created_at else None,
        } for f in faqs])


# ============================================================================
# Social Media APIs
# ============================================================================

class SocialAccountsViewSet(viewsets.ModelViewSet):
    """ViewSet for social media accounts."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return SocialAccount.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        accounts = self.get_queryset()
        return Response([{
            "id": a.id,
            "username": a.handle,
            "platform": a.platform,
            "is_active": True,
            "follower_count": 0,  # Will be populated from external API
            "engagement_rate": "0%",  # Will be populated from metrics
            "connected_at": a.connected_at.isoformat() if a.connected_at else None,
        } for a in accounts])


class SocialPostsViewSet(viewsets.ModelViewSet):
    """ViewSet for social media posts."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return Post.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        posts = self.get_queryset()
        return Response([{
            "id": p.id,
            "content": p.content[:200] + "..." if len(p.content) > 200 else p.content,
            "platform": p.platforms[0] if p.platforms else "general",
            "status": p.status,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "posted_date": p.published_at.isoformat() if p.published_at else None,
            "like_count": 0,  # From engagement metrics
            "comment_count": p.comments.count(),
            "share_count": 0,  # From engagement metrics
        } for p in posts])


class SocialConversationsViewSet(viewsets.ModelViewSet):
    """ViewSet for social media conversations."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return SocialConversation.objects.filter(account__tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        conversations = self.get_queryset()
        return Response([{
            "id": c.id,
            "participant_name": c.subject or "Group Conversation",
            "last_message": c.messages.first().content[:100] + "..." if c.messages.exists() else "No messages",
            "unread": c.messages.filter(is_read=False).count(),
            "updated_at": c.updated_at.isoformat() if c.updated_at else None,
        } for c in conversations])


# ============================================================================
# Email Engine APIs
# ============================================================================

class EmailListsViewSet(viewsets.ModelViewSet):
    """ViewSet for email lists."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return EmailList.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        lists = self.get_queryset()
        return Response([{
            "id": l.id,
            "name": l.name,
            "subscriber_count": l.contact_set.filter(subscribed=True).count(),
            "is_active": True,
            "open_rate": "0%",  # Will be calculated from send metrics
            "created_at": l.created_at.isoformat() if l.created_at else None,
            "description": f"Lawful basis: {l.lawful_basis}",
        } for l in lists])


class EmailTemplatesViewSet(viewsets.ModelViewSet):
    """ViewSet for email templates."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return EmailTemplate.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        templates = self.get_queryset()
        return Response([{
            "id": t.id,
            "name": t.name,
            "subject": t.subject,
            "is_active": True,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "date_created": t.created_at.isoformat() if t.created_at else None,
        } for t in templates])


class EmailFlowsViewSet(viewsets.ModelViewSet):
    """ViewSet for email automation flows."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return EmailFlow.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        flows = self.get_queryset()
        return Response([{
            "id": f.id,
            "name": f.name,
            "is_active": f.enabled,
            "description": f.description or "Email automation flow",
            "created_at": f.created_at.isoformat() if f.created_at else None,
        } for f in flows])


# ============================================================================
# Marketplace Reviews API
# ============================================================================

class MarketplaceReviewsViewSet(viewsets.ModelViewSet):
    """ViewSet for marketplace product reviews."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return Review.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        reviews = self.get_queryset()
        return Response([{
            "id": r.id,
            "product_id": r.product.id,
            "product_title": r.product.title,
            "rating": r.rating,
            "title": r.title,
            "comment": r.comment[:200] + "..." if len(r.comment) > 200 else r.comment,
            "reviewer": r.reviewer.username,
            "verified_purchase": r.verified_purchase,
            "helpful_count": r.helpful_count,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        } for r in reviews])

    def retrieve(self, request, pk=None):
        review = get_object_or_404(self.get_queryset(), pk=pk)
        return Response({
            "id": review.id,
            "product_id": review.product.id,
            "product_title": review.product.title,
            "rating": review.rating,
            "title": review.title,
            "comment": review.comment,
            "reviewer": review.reviewer.username,
            "verified_purchase": review.verified_purchase,
            "helpful_count": review.helpful_count,
            "created_at": review.created_at.isoformat(),
            "updated_at": review.updated_at.isoformat(),
        })


# ============================================================================
# Marketplace Orders API
# ============================================================================

class MarketplaceOrdersViewSet(viewsets.ModelViewSet):
    """ViewSet for marketplace orders."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return Order.objects.filter(buyer__in=tenants) | Order.objects.filter(seller__in=tenants)

    def list(self, request, *args, **kwargs):
        orders = self.get_queryset().distinct()
        return Response([{
            "id": o.id,
            "order_number": o.order_number,
            "product_title": o.product.title,
            "buyer": o.buyer.name,
            "seller": o.seller.name,
            "total_price": float(o.total_price) if o.total_price else 0,
            "status": o.status,
            "quantity": o.quantity,
            "created_at": o.created_at.isoformat() if o.created_at else None,
        } for o in orders])


# ============================================================================
# Marketplace Saved Products API
# ============================================================================

class MarketplaceSavedProductsViewSet(viewsets.ModelViewSet):
    """ViewSet for saved/bookmarked products."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return SavedProduct.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        saved = self.get_queryset()
        return Response([{
            "id": s.id,
            "product_id": s.product.id,
            "product_title": s.product.title,
            "product_price": float(s.product.price) if s.product.price else 0,
            "product_image": s.product.featured_image,
            "category": s.product.category,
            "rating": float(s.product.rating),
            "saved_at": s.created_at.isoformat() if s.created_at else None,
        } for s in saved])


# ============================================================================
# ASO Keywords & Listings API
# ============================================================================

class ASOKeywordsViewSet(viewsets.ModelViewSet):
    """ViewSet for ASO app keywords."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return AppKeyword.objects.filter(app__tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        keywords = self.get_queryset()
        return Response([{
            "id": k.id,
            "app_id": k.app.id,
            "app_name": k.app.name,
            "keyword": k.keyword,
            "position": k.position,
            "search_volume": k.search_volume if hasattr(k, 'search_volume') else 0,
            "tracking": k.tracking if hasattr(k, 'tracking') else False,
        } for k in keywords])


class ASOListingsViewSet(viewsets.ModelViewSet):
    """ViewSet for ASO app store listings."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return AppListing.objects.filter(app__tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        listings = self.get_queryset()
        return Response([{
            "id": l.id,
            "app_id": l.app.id,
            "app_name": l.app.name,
            "locale": l.locale if hasattr(l, 'locale') else 'en',
            "title": l.title if hasattr(l, 'title') else 'N/A',
            "subtitle": l.subtitle if hasattr(l, 'subtitle') else '',
            "description": (l.description if hasattr(l, 'description') else '')[:100] + "...",
        } for l in listings])


# ============================================================================
# Email Contacts & Sends API
# ============================================================================

class EmailContactsViewSet(viewsets.ModelViewSet):
    """ViewSet for email list contacts."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return Contact.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        contacts = self.get_queryset()
        return Response([{
            "id": c.id,
            "email": c.email,
            "name": c.name,
            "subscribed": c.subscribed,
            "subscribed_at": c.subscribed_at.isoformat() if c.subscribed_at else None,
            "unsubscribed_at": c.unsubscribed_at.isoformat() if c.unsubscribed_at else None,
        } for c in contacts])


class EmailSendsViewSet(viewsets.ModelViewSet):
    """ViewSet for email send records."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return EmailSend.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        sends = self.get_queryset()
        return Response([{
            "id": s.id,
            "recipient_email": s.recipient.email if s.recipient else 'Unknown',
            "template_name": s.template.name if s.template else 'N/A',
            "status": s.status,
            "sent_at": s.sent_at.isoformat() if s.sent_at else None,
            "message_id": s.message_id,
            "bounces": s.bounces,
            "complaints": s.complaints,
        } for s in sends])


# ============================================================================
# Social Media Comments & Engagement API
# ============================================================================

class SocialCommentsViewSet(viewsets.ModelViewSet):
    """ViewSet for social media post comments."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return Comment.objects.filter(post__tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        comments = self.get_queryset()
        return Response([{
            "id": c.id,
            "post_id": c.post.id,
            "post_title": c.post.title,
            "author": c.author.username,
            "content": c.content[:150] + "..." if len(c.content) > 150 else c.content,
            "is_approved": c.is_approved,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        } for c in comments])


class SocialEngagementViewSet(viewsets.ModelViewSet):
    """ViewSet for social media post engagement metrics."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return Engagement.objects.filter(post__tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        engagements = self.get_queryset()
        return Response([{
            "id": e.id,
            "post_id": e.post.id,
            "post_title": e.post.title,
            "platform": e.platform,
            "likes": e.likes,
            "shares": e.shares,
            "comments": e.comments,
            "clicks": e.clicks,
            "impressions": e.impressions,
            "reach": e.reach,
            "timestamp": e.timestamp.isoformat() if e.timestamp else None,
        } for e in engagements])


# ============================================================================
# Analytics PageView API
# ============================================================================

class AnalyticsPageViewsViewSet(viewsets.ModelViewSet):
    """ViewSet for website page views."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return PageView.objects.filter(site__tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        pageviews = self.get_queryset()[:100]  # Last 100
        return Response([{
            "id": pv.id,
            "site_domain": pv.site.domain,
            "url": pv.url,
            "visitor_id": pv.visitor_id,
            "duration": pv.duration,
            "bounce": pv.bounce,
            "referrer": pv.referrer or "Direct",
            "timestamp": pv.timestamp.isoformat() if pv.timestamp else None,
        } for pv in pageviews])


# ============================================================================
# Tenants Integrations API
# ============================================================================

class TenantIntegrationsViewSet(viewsets.ModelViewSet):
    """ViewSet for tenant integrations."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        from tenants.models import Integration
        return Integration.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        integrations = self.get_queryset()
        return Response([{
            "id": i.id,
            "name": i.name if hasattr(i, 'name') else 'Integration',
            "service": i.service if hasattr(i, 'service') else 'Unknown',
            "is_active": i.is_active if hasattr(i, 'is_active') else True,
            "connected_at": i.connected_at.isoformat() if hasattr(i, 'connected_at') and i.connected_at else None,
        } for i in integrations])


# ============================================================================
# Marketplace Conversations & Messages API
# ============================================================================

class MarketplaceConversationsViewSet(viewsets.ModelViewSet):
    """ViewSet for marketplace buyer-seller conversations."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return MarketplaceConversation.objects.filter(tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        convos = self.get_queryset()
        return Response([{
            "id": c.id,
            "buyer": c.buyer.name if c.buyer else 'Unknown',
            "seller": c.seller.name if c.seller else 'Unknown',
            "product_title": c.product.title if c.product else 'N/A',
            "message_count": c.marketplacemessage_set.count() if hasattr(c, 'marketplacemessage_set') else 0,
            "last_message": c.last_message_at.isoformat() if hasattr(c, 'last_message_at') and c.last_message_at else None,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        } for c in convos])


class MarketplaceMessagesViewSet(viewsets.ModelViewSet):
    """ViewSet for marketplace conversation messages."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return MarketplaceMessage.objects.filter(conversation__tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        messages = self.get_queryset()[:100]  # Last 100
        return Response([{
            "id": m.id,
            "conversation_id": m.conversation.id,
            "sender": m.sender.username if m.sender else 'Unknown',
            "content": m.content[:200] + "..." if len(m.content) > 200 else m.content,
            "is_read": m.is_read,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        } for m in messages])


# ============================================================================
# Social Media Messages API
# ============================================================================

class SocialMessagesViewSet(viewsets.ModelViewSet):
    """ViewSet for social media direct messages."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        tenants = get_user_tenants(user)
        return SocialMessage.objects.filter(conversation__account__tenant__in=tenants)

    def list(self, request, *args, **kwargs):
        messages = self.get_queryset()[:100]  # Last 100
        return Response([{
            "id": m.id,
            "conversation_id": m.conversation.id,
            "sender_id": m.sender_id,
            "content": m.content[:200] + "..." if len(m.content) > 200 else m.content,
            "timestamp": m.timestamp.isoformat() if m.timestamp else None,
        } for m in messages])
