
![](/static/peopleplusai.png "Open Cloud Compute")

# ⚡ City AI Engine
City AI Engine is an app helps analyze the quality of footpaths and provides actionable insights to improve urban infrastructure. The Tool leverages computer vision techniques to assess the condition and quality of footpaths in urban areas. By analysing visual data collected from city streets, the tool provides an objective evaluation of footpaths, identifying issues such as obstructions, surface irregularities, and other factors that affect pedestrian mobility and safety.

## 🛠 Get started

1. Clone the repository
   ```
   git clone https://github.com/ArpitSureka/cityAiBackend.git
   ```
2. Create a virtual environment and enter inside the virtual environment. The recommended Python version is Python 3.10
4. Inside the virtual environment install all dependencies using the command
   ```pip install -r requirements.txt```

## Creating the Environment Variables
Create an `.env` file and follow the variable name based on `.env.example` and follow the given steps.
- Generate and add your OpenAI API Key in the `OPENAI_API_KEY` field
- Create a account on Google Cloud Console and add the `GOOGLE_OAUTH_CLIENT_ID` and `CLIENT_SECRET` for enabling Google OAuth
- Set up a Postgress Database Locally and add the Database credentials in the `.env` file

## Steps to create Google ID:
To generate Google Client ID and API key for social authentication, follow these steps:
1. Go to Google Developers Console
 - Log in with your Google account
 - Click "Select a project" and create a new project
 - Configure OAuth Consent Screen
 - Navigate to "OAuth consent screen"
 - Choose "User Type" as External
 - Add application name, support email, and authorized domain
 - Save and continue through the configuration steps
2. Create Credentials
 - Go to the "Credentials" section
 - Click "Create Credentials"
 - Select "OAuth client ID"
 - Choose "Web application" as the application type
 - Enter your application name
 - Add authorized JavaScript origins and redirect URIs
 - Click "Create"
3. Generate API Key
 - In the Credentials section
 - Click "Create Credentials"
 - Select "API key"
 - Copy and save the generated API key

## Starting the server
- Start the Django Server using the command ```python manage.py runserv localhost:8000```
- Open local host:8000 on your browser to check the website



## Contributing


We welcome contributions from the community. To contribute to this project, please follow the guidelines outlined in [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## Documentation

Explain where to find and how to use your project's documentation:

The `docs` folder contains project documentation and related documents. To access or contribute to the documentation, please refer to [docs/README.md](docs/README.md).

## Issues
If you encounter any issues with the project, please create a new issue using the [issue template](.github/ISSUE_TEMPLATE.md). Provide as much detail as possible to help us understand and resolve the issue.


## Volunteer & contribute

If you are interested in volunteering for this project, please refer to [this link](https://peopleplus.ai/volunteer) for more information. 

If you would like to contribute to the codebase, please refer to the [CONTRIBUTING.md](.github/CONTRIBUTING.md) file for more information. We appreciate your contributions!


## About Us

People+ai connects do-ers, dreamers, tinkerers and innovators with ideas & resources to build an ecosystem that can empower a billion people to reach their potential - [Know More](https://peopleplus.ai/)




