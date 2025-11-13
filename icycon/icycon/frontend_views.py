from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import render, redirect
from django.contrib import messages
from django import forms
from django.contrib.auth.models import User
from django.conf import settings
from django.http import FileResponse
from pathlib import Path


class ProfileForm(forms.ModelForm):
	class Meta:
		model = User
		fields = ['first_name', 'last_name', 'email']


@login_required
def account_dashboard(request):
	user = request.user

	if request.method == 'POST':
		if 'save_profile' in request.POST:
			profile_form = ProfileForm(request.POST, instance=user)
			password_form = PasswordChangeForm(user)
			if profile_form.is_valid():
				profile_form.save()
				messages.success(request, 'Profile updated successfully.')
				return redirect('account')
		elif 'change_password' in request.POST:
			profile_form = ProfileForm(instance=user)
			password_form = PasswordChangeForm(user, request.POST)
			if password_form.is_valid():
				user = password_form.save()
				update_session_auth_hash(request, user)  # keep the user logged in
				messages.success(request, 'Password changed successfully.')
				return redirect('account')
		else:
			profile_form = ProfileForm(instance=user)
			password_form = PasswordChangeForm(user)
	else:
		profile_form = ProfileForm(instance=user)
		password_form = PasswordChangeForm(user)

	return render(request, 'account_dashboard.html', {
		'profile_form': profile_form,
		'password_form': password_form,
	})


def serve_react_frontend(request):
	"""Serve the built React app index.html from static/frontend/index.html.

	If the built file isn't present (e.g. during development), fall back to
	rendering the server-side 'home.html' template so the site still works.
	"""
	# settings.BASE_DIR in this project is a pathlib.Path
	index_path = Path(settings.BASE_DIR) / 'static' / 'frontend' / 'index.html'
	if index_path.exists():
		# Use FileResponse to stream the file directly
		return FileResponse(open(index_path, 'rb'), content_type='text/html')
	# Fallback to existing server-rendered home page
	return render(request, 'home.html')

