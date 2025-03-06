# Weather Application - README

## Overview
This weather application uses the OpenWeatherMap API to fetch and display current weather data, as well as a 5-day forecast for any specified location. The application provides temperature details, weather conditions, and other relevant information, along with visual charts for temperature changes and weather conditions over the next few days.

## Features
- **Current Weather:** Displays the current temperature, humidity, wind speed, and weather description for the user's location or any searched city.
- **5-Day Forecast:** Provides weather forecasts for the next five days.
- **Temperature and Condition Filters:** Sort and filter weather data based on temperature (ascending/descending) or specific weather conditions (rain, highest temperature).
- **Charts:** Visual representation of temperature trends using Bar, Doughnut, and Line charts (via Chart.js).
- **Chatbot:** A simple chatbot interface that allows users to interact with the weather app using natural language queries. The chatbot function, handleOtherChatMessages(userInput), integrates with the Gemini API to generate responses based on user input.

## Technologies
- **Frontend:** HTML, CSS, Javascript(jQuery)
- **API Integration:** OpenWeatherMap API, Gemini API
- **Charts:** Chart.js for visualizing weather data [Chart.js](https://www.chartjs.org/docs/latest/)
- **Location Services:** Geolocation API

## Getting Started

## Prerequisites

To run this application, you will need:

### 1. Software Requirements
- **Node.js** and **npm** (download from [here](https://nodejs.org/))
- A web browser with JavaScript enabled.

### 2. Network Requirements
- Internet connection to fetch live weather data.

### 3. API Keys
- An API key from **OpenWeatherMap** (sign up at [here](https://home.openweathermap.org/users/sign_up) and obtain API key).
- An API key from **Gemini API** (sign up at [here](https://ai.google.dev/aistudio) and get API key).


## Installation
1. Clone the repository or download the project files.
    You can clone the repository using the following command in your terminal:
   ```bash
   git clone https://github.com/Fatima-Rathore-2018/SkySense_Weather-App.git
   ```
3. Navigate to the project directory using the command given below.
   ```bash
   cd SkySense_Weather-App
   ```
5. Install the necessary dependencies using npm.
   ```bash
   npm install
   ```
4. Enter your API keys in the relevant section of the code.
   
## Executing the Program with Live Server

### 1. Open Your Project Folder
- In VS Code, open the folder containing your project files by going to **File > Open Folder...** and selecting your project directory.

### 2. Start Live Server
- Open your `.html` file.
- Right-click anywhere in the editor window and select **"Open with Live Server."**
- Alternatively, you can click on the **Go Live** button in the bottom right corner of the VS Code window.

### 3. Stop Live Server
- To stop the server, you can click on the **"Port: 5500"** indicator in the bottom right corner of the VS Code window, or simply close the browser tab.


### Author: Fatima Rathore (22i-2631)
   
