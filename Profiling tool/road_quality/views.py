import os
import uuid
import json
import base64
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.files.storage import default_storage
from django.http import HttpResponse
from .models import RoadImage
from .agent import model
from .prompt import road_walkability_prompt
from langchain_core.messages import HumanMessage, SystemMessage
from django.shortcuts import render
from account.models import CustomUser
from .utils import format_timestamp

@csrf_exempt
@login_required
def upload_image(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        lat = request.POST.get('lat')
        long = request.POST.get('long')

        if not file:
            return JsonResponse({'error': 'No file provided'}, status=400)

        # Generate a unique filename
        file_extension = file.name.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(settings.MEDIA_ROOT, filename)

        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT)

        # Save the file
        with default_storage.open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        # Save the image to the database
        user = CustomUser.objects.filter(id=request.session.get('_auth_user_id')).first()
        image = RoadImage.objects.create(
            road_image_filename=filename,
            road_image_url = f"{settings.MEDIA_URL}{filename}",
            latitude=lat, 
            longitude=long, 
            user=user,
            device_info=json.loads(request.POST.get('deviceInfo')),
            location_info=json.loads(request.POST.get('geolocation')),
        )

        # Read the file and encode it
        with open(file_path, 'rb') as image_file:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')

        # Asking GPT to describe the image
        system_message = SystemMessage(content=road_walkability_prompt)
        human_message = HumanMessage(
            content=[
                {"type": "text", "text": "The image to be graded is given below"},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image_data}"},
                },
            ],
        )
        response = model.invoke([system_message, human_message])

        try:
            output = json.loads(response.content)
            image.overall_score = output["overall_score"]
            image.negative_components = output["negative_components"]
            image.actionable_recommendations = output["actionable_recommendations"]
            image.save()
            
            timestamp = format_timestamp(image.location_info)

            return JsonResponse({
                "id": image.id,
                "timestamp": timestamp,
                "filename": filename,
                "latitude": lat,
                "longitude": long,
                "response": output["overall_score"],
                "negative_components": output["negative_components"],
                "actionable_recommendations": output["actionable_recommendations"],
            })
        except Exception as e:
            print(response.content)
            print(str(e))
            return JsonResponse({'error': 'Parsing Failed'}, status=500)

    if request.method == 'GET':
        user = CustomUser.objects.filter(id=request.session.get('_auth_user_id')).first()
        user_history_images = get_user_history_list(user)
        # print(user_history_images)
        # Make is_authorized variable if required later
        context = {
            "is_authorized": True,
            "user_history_images": user_history_images,
            "site_url": os.getenv("SITE_URL"),
        }
        return render(request, 'index.html', context)
            
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
@login_required
def get_previous_response(request, id):
    if request.method == 'GET':
        user = CustomUser.objects.filter(id=request.session.get('_auth_user_id')).first()
        image_obj = RoadImage.objects.filter(id=id, user=user).first()
        if not image_obj:
            return JsonResponse({'error': 'Response not found'}, status=404)
        context = {
            "site_url": os.getenv("SITE_URL"),
            "is_authorized": True,
            "filename": image_obj.road_image_filename,
            "latitude": image_obj.latitude,
            "longitude": image_obj.longitude,
            "response": image_obj.overall_score,
            "negative_components": image_obj.negative_components,
            "actionable_recommendations": image_obj.actionable_recommendations,
            "road_image_url": image_obj.road_image_url
        }
        return render(request, 'image_response.html', context)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def get_all_response(request):
    if request.method == 'GET':
        image_objects = list(RoadImage.objects.values('id', 'road_image_filename','road_image_url', 'latitude', 'longitude', 'overall_score', 'negative_components', 'actionable_recommendations'))
        if not image_objects:
            return JsonResponse({'error': 'Response not found'}, status=404)
        image_json= json.dumps(image_objects)
        context={
            "image_objects":image_json
        }
        return render(request, 'visualization.html', context)
    return JsonResponse({'error': 'Invalid request method'}, status=405)



def get_user_history_list(user):
    data = RoadImage.objects.filter(user=user).values('id', 'overall_score','location_info')
    images=[]
    for item in reversed(data):
        image_data = {
            "id": item["id"],
            "overall_score": item["overall_score"],
            "timestamp":format_timestamp(item["location_info"])
        }
        images.append(image_data)

    return images