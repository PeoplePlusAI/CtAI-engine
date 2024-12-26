from langchain.prompts import PromptTemplate

prompt_template = PromptTemplate(
    input_variables=["filename"],
    template="You have received an image file named '{filename}'. What could be a good next step or action for this image?"
)