from django.db import models

class RoadImage(models.Model):
    road_image_url = models.URLField(null=True, blank=True)
    road_image_filename = models.CharField(max_length=255)
    latitude = models.CharField(max_length=50)
    longitude = models.CharField(max_length=50)
    overall_score = models.IntegerField(null=True, blank=True)
    negative_components = models.TextField(null=True, blank=True)
    actionable_recommendations = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey("account.CustomUser", on_delete=models.DO_NOTHING, null=True, blank=True)
    device_info = models.JSONField(null=True, blank=True)
    location_info = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Road Image {self.id}"