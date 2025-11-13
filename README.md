# Icycon

A multi-tenant web application for managing digital marketing and content.

## Setup

1. Clone the repository:
```bash
git clone https://github.com/agentikxai/icycon_.git
cd icycon_
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Copy the example env file and edit with your values
cp .env.example .env
```

Required environment variables:
- `DJANGO_SECRET_KEY`: Django secret key
- `OPENAI_API_KEY`: Your OpenAI API key
- `EMAIL_HOST_USER`: Email sending account
- `EMAIL_HOST_PASSWORD`: Email account password/app password

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

The server will run at http://127.0.0.1:8000
Visit http://127.0.0.1:8000/admin to access the admin interface.

## Development

- The project uses python-dotenv for environment variable management
- Environment variables are loaded from `.env` file in the project root
- Never commit `.env` file - use `.env.example` as a template
- Keep `requirements.txt` updated when adding new dependencies

 ## Notes
 -dry run user is the obly one who can see the chat bot admins cannot 

## Deploying to Heroku

1. Register for a free Heroku account: https://signup.heroku.com/
2. Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Login and create a new app:
	```bash
	heroku login
	heroku create your-app-name
	```
4. Set environment variables in Heroku dashboard (Settings > Config Vars):
	- DJANGO_SECRET_KEY
	- OPENAI_API_KEY
	- EMAIL_HOST_USER
	- EMAIL_HOST_PASSWORD
	- DJANGO_ALLOWED_HOSTS (e.g. your-app-name.herokuapp.com)
	- DJANGO_DEBUG (optional, set to False)
5. Deploy:
	```bash
	git push heroku master
	heroku run python manage.py migrate
	heroku run python manage.py collectstatic --noinput
	```
6. Visit your app at https://your-app-name.herokuapp.com


## Deploying to Vercel

Quick notes to prepare this project for Vercel:

- Required environment variables (set in Vercel dashboard):
	- `DJANGO_SECRET_KEY`
	- `OPENAI_API_KEY`
	- `EMAIL_HOST_USER`
	- `EMAIL_HOST_PASSWORD`
	- `DJANGO_ALLOWED_HOSTS` (comma-separated, e.g. `yourdomain.com,vercel.app`)
	- `DJANGO_DEBUG` (optional, set to `False` in production)


- Vercel will install dependencies from `requirements.txt` and use `icycon/wsgi.py` as the app entrypoint. Vercel runs Python code as serverless functions; to ensure static files are available you should run `collectstatic` during the build. Set the following Build Command in the Vercel project settings:

```bash
python -m pip install -r requirements.txt
python manage.py collectstatic --noinput
```

- In the Vercel dashboard set Environment Variables (Project Settings > Environment Variables):
	- `DJANGO_SECRET_KEY`
	- `OPENAI_API_KEY`
	- `EMAIL_HOST_USER`
	- `EMAIL_HOST_PASSWORD`
	- `DJANGO_ALLOWED_HOSTS` (comma-separated)
	- `DJANGO_DEBUG` (optional)

- Note: Vercel's runtime is serverless — it does not run a persistent Gunicorn process. The `Procfile` and `runtime.txt` used by Heroku-style buildpacks are not required for a Vercel-only deployment.

