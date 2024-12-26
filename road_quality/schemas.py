from pydantic import BaseModel, Field
from typing import List,Optional
from typing_extensions import TypedDict

class UploadImageSchema(BaseModel):
    road_image: str
    latitude: str
    longitude: str

    class Config:
        from_attributes = True

class ComponentSchema(TypedDict):
    attribute_name: str = Field(description="The name of the attritubute that is being assessed. Can be one of Surface Condition, Width Compliance, Obstructions, Safety Features, or Accessibility Features.")
    score: int = Field(description="The score of the attribute. Should be an integer from 1 to 5.")
    assessment: str = Field(description="The assessment of the attribute. Assesment would contain the reasoning behind the score")

class RoadQualitySchema(BaseModel):
    overall_score: int = Field(description="The overall score of the road image. Should be an integer from 1 to 5.")
    negative_components: str = Field(description="A breakdown of any obstructions to walkability and their levels of severity")
    actionable_recommendations: str = Field(description="Suggest areas for improvement to enhance pedestrian mobility and safety")
    components: List[ComponentSchema] 

    class Config:
        from_attributes = True

##GeoDB
##GeoSQL