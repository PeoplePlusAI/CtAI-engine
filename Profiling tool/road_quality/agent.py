from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from .schemas import RoadQualitySchema, ComponentSchema
from langchain_core.output_parsers import PydanticOutputParser
import os
from  dotenv import load_dotenv

load_dotenv()
model = ChatOpenAI(model="gpt-4o", openai_api_key=os.getenv("OPENAI_API_KEY"),model_kwargs= {
     "response_format": RoadQualitySchema
   })
parser = PydanticOutputParser(pydantic_object=RoadQualitySchema)
