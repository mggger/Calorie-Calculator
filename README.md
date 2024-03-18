# Introduction

This project allows users to upload images of food. Utilizing AI technology, it identifies the food in the images and displays the identified food along with the total calorie count. This is a useful tool for those interested in tracking their dietary intake or simply curious about the caloric content of various foods.

![example1](https://github.com/mggger/Calorie-Calculator/blob/main/images/example1.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Set up Environment Variables

Before running the application, you need to set up some environment variables that are necessary for the project's features, such as Google Analytics and Google AI API.

**Create a .env File**

Create a `.env` file in the root directory of your project and add the following configurations for Google Analytics ID and Google Gemini API Key:

```plaintext
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="your_google_analytics_id_here"
NEXT_PUBLIC_GOOGLE_AI_API_KEY="your_google_ai_api_key_here"
```

Please replace "your_google_analytics_id_here" and "your_google_ai_api_key_here" with your actual Google Analytics ID and Google AI API Key.

## Run the Project
To run the project on your local machine, use the following command:

```
npm run dev
```