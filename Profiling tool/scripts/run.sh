python manage.py migrate
python manage.py collectstatic --no-input
uwsgi --chdir=/app \
	--module=cityAiBackend.wsgi:application \
	--env DJANGO_SETTINGS_MODULE=cityAiBackend.settings \
	--master \
	--processes=5 \
	--max-requests=5000 \
	--http=:8000

