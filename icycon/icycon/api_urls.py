"""
API URL patterns for SPA-compatible endpoints.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    DashboardView,
    ASOAppViewSet,
    ASOKeywordsViewSet,
    ASOListingsViewSet,
    MarketplaceProductViewSet,
    MarketplaceReviewsViewSet,
    MarketplaceOrdersViewSet,
    MarketplaceSavedProductsViewSet,
    MarketplaceConversationsViewSet,
    MarketplaceMessagesViewSet,
    AnalyticsSitesViewSet,
    AnalyticsPageViewsViewSet,
    ExportAnalyticsView,
    MultilingualSummaryView,
    TenantSummaryView,
    TenantMembersView,
    TenantIntegrationsViewSet,
    SEOSitesViewSet,
    SEOKeywordClustersViewSet,
    SEOContentItemsViewSet,
    SEOFAQsViewSet,
    SocialAccountsViewSet,
    SocialPostsViewSet,
    SocialConversationsViewSet,
    SocialCommentsViewSet,
    SocialEngagementViewSet,
    SocialMessagesViewSet,
    EmailListsViewSet,
    EmailTemplatesViewSet,
    EmailFlowsViewSet,
    EmailContactsViewSet,
    EmailSendsViewSet,
)

router = DefaultRouter()
router.register(r'aso/apps', ASOAppViewSet, basename='aso-apps')
router.register(r'aso/keywords', ASOKeywordsViewSet, basename='aso-keywords')
router.register(r'aso/listings', ASOListingsViewSet, basename='aso-listings')
router.register(r'marketplace/products', MarketplaceProductViewSet, basename='marketplace-products')
router.register(r'marketplace/reviews', MarketplaceReviewsViewSet, basename='marketplace-reviews')
router.register(r'marketplace/orders', MarketplaceOrdersViewSet, basename='marketplace-orders')
router.register(r'marketplace/saved', MarketplaceSavedProductsViewSet, basename='marketplace-saved')
router.register(r'marketplace/conversations', MarketplaceConversationsViewSet, basename='marketplace-conversations')
router.register(r'marketplace/messages', MarketplaceMessagesViewSet, basename='marketplace-messages')
router.register(r'analytics/sites', AnalyticsSitesViewSet, basename='analytics-sites')
router.register(r'analytics/pageviews', AnalyticsPageViewsViewSet, basename='analytics-pageviews')
router.register(r'seo/sites', SEOSitesViewSet, basename='seo-sites')
router.register(r'seo/keywords', SEOKeywordClustersViewSet, basename='seo-keywords')
router.register(r'seo/content', SEOContentItemsViewSet, basename='seo-content')
router.register(r'seo/faqs', SEOFAQsViewSet, basename='seo-faqs')
router.register(r'social/accounts', SocialAccountsViewSet, basename='social-accounts')
router.register(r'social/posts', SocialPostsViewSet, basename='social-posts')
router.register(r'social/conversations', SocialConversationsViewSet, basename='social-conversations')
router.register(r'social/comments', SocialCommentsViewSet, basename='social-comments')
router.register(r'social/engagement', SocialEngagementViewSet, basename='social-engagement')
router.register(r'social/messages', SocialMessagesViewSet, basename='social-messages')
router.register(r'email/lists', EmailListsViewSet, basename='email-lists')
router.register(r'email/templates', EmailTemplatesViewSet, basename='email-templates')
router.register(r'email/flows', EmailFlowsViewSet, basename='email-flows')
router.register(r'email/contacts', EmailContactsViewSet, basename='email-contacts')
router.register(r'email/sends', EmailSendsViewSet, basename='email-sends')
router.register(r'tenants/integrations', TenantIntegrationsViewSet, basename='tenants-integrations')

urlpatterns = [
    # Router endpoints
    path('', include(router.urls)),
    
    # Dashboard
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    
    # Multilingual
    path('multilingual/summary/', MultilingualSummaryView.as_view(), name='multilingual-summary'),
    
    # Tenants
    path('tenants/summary/', TenantSummaryView.as_view(), name='tenants-summary'),
    path('tenants/<int:tenant_id>/members/', TenantMembersView.as_view(), name='tenant-members'),
    # Analytics export
    path('analytics/export/', ExportAnalyticsView.as_view(), name='analytics-export'),
]
