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


2. Install the necessary dependencies using npm.
3. Open the index.html file in your web browser.
4. Enter your API key in the relevant section of the code.


## Executing the Program with Live Server

### 1. Install Live Server (if not already installed)
- If you are using Visual Studio Code, you need to install the Live Server extension.
- Open VS Code, go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side or by pressing `Ctrl + Shift + X`.
- Search for **"Live Server"** and click **Install**.

### 2. Open Your Project Folder
- In VS Code, open the folder containing your project files by going to **File > Open Folder...** and selecting your project directory.

### 3. Start Live Server
- Open your `index.html` file.
- Right-click anywhere in the editor window and select **"Open with Live Server."**
- Alternatively, you can click on the **Go Live** button in the bottom right corner of the VS Code window.

### 4. View in Browser
- This will automatically open your default web browser and navigate to ` http://192.168.100.63:8080` (or a similar address) where your project is being served.
- Any changes you make to your files will automatically refresh the browser, allowing you to see updates in real-time.

### 5. Stop Live Server
- To stop the server, you can click on the **"Port: 5500"** indicator in the bottom right corner of the VS Code window, or simply close the browser tab.



   
