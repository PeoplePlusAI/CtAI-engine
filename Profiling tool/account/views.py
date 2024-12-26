from django.shortcuts import render
import os
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests
from django.http import HttpResponse, HttpRequest
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from . import models
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from  dotenv import load_dotenv

load_dotenv()

@csrf_exempt
def login(request):
    context={
        "site_url": os.getenv("SITE_URL"),
        "google_client_id": os.getenv("GOOGLE_OAUTH_CLIENT_ID"),
    }
    return render(request, 'login.html',context)


@csrf_exempt
def auth_receiver(request):
    """
    Google calls this URL after the user has signed in with their Google account.
    """
    token = request.POST['credential']

    try:
        user_data = id_token.verify_oauth2_token(
            token, requests.Request(), os.environ['GOOGLE_OAUTH_CLIENT_ID']
        )
        user, created = models.CustomUser.objects.get_or_create(
            email=user_data["email"], defaults={ "sign_up_method": "google",
                "first_name": user_data.get("given_name"),
                "last_name": user_data.get("family_name"),
            }
        )
        auth_login(request, user)
    except ValueError as e:
        print(str(e))
        return HttpResponse(status=403)

    # In a real app, I'd also save any new user here to the database.
    # You could also authenticate the user here using the details from Google (https://docs.djangoproject.com/en/4.2/topics/auth/default/#how-to-log-a-user-in)
    request.session['google_user_data'] = user_data
    request.session['is_authorized'] = user.is_authorized

    return redirect('home')


def logout(request):
    auth_logout(request)
    return render(request, 'logout.html')
