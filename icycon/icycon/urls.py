from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth import views as auth_views
from .frontend_views import serve_react_frontend

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
    
    # New unified API endpoints for React frontend (replaces template views)
    path('api/', include('icycon.api_urls')),
    
    # Serve React SPA from root (built into static/frontend/index.html). If
    # the frontend hasn't been built yet this will fall back to the server-
    # rendered `home.html` template.
    path('', serve_react_frontend, name='home'),
    
    # User management (profile, account, settings)
    path('users/', include('users.urls')),
    # Authentication
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
]