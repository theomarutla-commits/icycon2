from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('analytics/', include('analytics.urls')),  # Combined SEO & Analytics
    path('seo/', include('seo.urls')),
    path('aso/', include('aso.urls')),
    path('marketplace/', include('marketplace.urls')),
    path('multilingual/', include('multilingual.urls')),
    path('social-media/', include('social_media.urls')),
    path('tenants/', include('tenants.urls')),
    path('api/chat/', include('chatbot.urls')),
    # Simple server-rendered pages to replace the React frontend during development
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('tenants-ui/', TemplateView.as_view(template_name='tenants.html'), name='tenants_ui'),
    path('signup/', TemplateView.as_view(template_name='signup.html'), name='signup'),
    # App overview pages (server-rendered)
    path('aso-ui/', TemplateView.as_view(template_name='aso.html'), name='aso_ui'),
    path('marketplace-ui/', TemplateView.as_view(template_name='marketplace.html'), name='marketplace_ui'),
    path('multilingual-ui/', TemplateView.as_view(template_name='multilingual.html'), name='multilingual_ui'),
    path('tenants-tenants/', TemplateView.as_view(template_name='tenants_tenants.html'), name='tenants_tenants'),
    path('tenants-tenant-users/', TemplateView.as_view(template_name='tenants_tenant_users.html'), name='tenants_tenant_users'),
    path('tenants-integrations/', TemplateView.as_view(template_name='tenants_integrations.html'), name='tenants_integrations'),
    # User management (profile, account, settings)
    path('users/', include('users.urls')),
    # Authentication
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
]