$(document).ready(function () {
    showLoader();

    const apiKey = '6beaceb65aa4ee60624314ea49d64c11';
    let lat, lon;

    // Function to get the user's current geographical location.
    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lon = position.coords.longitude;

                defaultWeather(lat, lon);
            }, function () {
                alert("Unable to retrieve your location.");
            });
        } else {
            alert("Geolocation is not supported.");
        }
    }

    // Function to fetch default weather data based on latitude and longitude.
    function defaultWeather(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        $.getJSON(url)
            .done(function (data) {
                fetchWeatherForecast(lat, lon);
            })
            .fail(function () {
                console.error('Error fetching default weather data.');
            })
            .always(function () {
                hideLoader();
            });
    }

    // Event listener for pressing the Enter key in the search input.
    $('#searchInput').on('keyup', function (event) {
        if (event.key === 'Enter') {
            $('#searchButton').click();
        }
    });

    // Event listener for the search button click.
    $('#searchButton').on('click', function () {
        const cityName = $('#searchInput').val();

        showLoader();

        fetchWeatherByCity(cityName);
    });

    // Function to fetch weather data for a specific city.
    function fetchWeatherByCity(cityName) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        $.getJSON(url)
            .done(function (data) {
                lat = data.coord.lat;
                lon = data.coord.lon;

                fetchWeatherForecast(lat, lon);
            })
            .fail(function () {
                console.error('Error fetching weather data for the city.');
            })
            .always(function () {
                hideLoader();
            });
    }

    let originalDataOfWeather;

    // Function to fetch the weather forecast based on latitude and longitude.
    function fetchWeatherForecast(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        $.getJSON(url)
            .done(function (data) {

                // This variable stores a deep copy of the data object so if filters are applied, the original data is not lost.
                // JSON.stringify(data) -> Converts the data object into a string.
                // JSON.parse() -> Takes the string and parses it back into a javascript object.
                originalDataOfWeather = JSON.parse(JSON.stringify(data));

                displayForecastData(data);
            })
            .fail(function () {
                console.error('Error fetching weather data');
            })
            .always(function () {
                hideLoader();
            });
    }

    let currentPageShown = 1;
    let weatherData;

    // Function to display the fetched weather forecast data.
    function displayForecastData(data) {
        weatherData = data;

        const weatherDataElement = $("#weatherData");
        weatherDataElement.empty();

        const totalNumberOfEntries = data.list.length;
        let totalPagesForPagination = Math.ceil(totalNumberOfEntries / 10);

        let initialIndex = (currentPageShown - 1) * 10;
        let minimumValue = totalNumberOfEntries;
        let endingIndex = initialIndex + 10;
        if (minimumValue > endingIndex) {
            minimumValue = endingIndex;
        }

        // Loop through the weather data and display each entry.
        for (let i = initialIndex; i < minimumValue; i++) {
            const theData = data.list[i];

            const date = new Date(theData.dt * 1000);
            const day = date.toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' });

            const hour = date.getHours();

            const temperature = Math.round(theData.main.temp);
            const condition = theData.weather[0].description;
            const timeLabel = twelveHourFormat(hour);
            const iconCode = theData.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            // <td><img src="${iconUrl}" alt="${condition}" class="weatherIconTable"> <div class="weatherConditionTable">${condition}</div></td>
            const row = `<tr>
            <td>${day}</td>
            <td>${timeLabel}</td>
            <td>${temperature} °C</td>
            <td>${condition}</td>
            <td><img src="${iconUrl}" alt="${condition}" class="weatherIconTable"></td>
        </tr>`;
            weatherDataElement.append(row);
        }

        showPaginationControls(totalPagesForPagination);
    }

    // Function to display pagination controls based on the total number of pages.
    function showPaginationControls(totalPages) {
        const paginationElement = $("#paginationControls");

        paginationElement.empty();

        let previousButton = '', nextButton = '';

        // Create previous button if not on the first page.
        if (currentPageShown > 1) {
            previousButton = `<button id="previousPage" class="paginationButtons">Previous</button>`;
        }

        // Create next button if not on the last page.
        if (currentPageShown < totalPages) {
            nextButton = `<button id="nextPage" class="paginationButtons">Next</button>`;
        }

        paginationElement.append(previousButton);
        paginationElement.append(`<p id="pageNumber">Page ${currentPageShown}</p>`);
        paginationElement.append(nextButton);

        if (currentPageShown === 1) {
            paginationElement.css('justify-content', 'flex-end');
            $('#pageNumber').css('margin-right', '33%');
        }
        else if (currentPageShown > 1 && currentPageShown < totalPages) {
            paginationElement.css('justify-content', 'space-between');
        }
        else {
            paginationElement.css('justify-content', 'flex-start');
            $('#pageNumber').css('margin-left', '33%');
        }

        $("#previousPage").on("click", function () {
            currentPageShown--;
            displayForecastData(weatherData);
        });

        $("#nextPage").on("click", function () {
            currentPageShown++;
            displayForecastData(weatherData);
        });
    }

    // Function to convert hour from 24-hour format to 12-hour format.
    function twelveHourFormat(hour) {
        let hour12;
        let period = "AM";

        if (hour === 0) {
            hour12 = 12;
        }
        else if (hour < 12) {
            hour12 = hour;
        }
        else if (hour === 12) {
            hour12 = 12;
            period = "PM";
        }
        else {
            hour12 = hour - 12;
            period = "PM";
        }

        return `${hour12}:00 ${period}`;
    }

    // Sorting temperatures in ascending order.
    $('#sortAscending').on('click', function () {
        const sortedData = JSON.parse(JSON.stringify(weatherData));

        sortedData.list.sort((a, b) => {
            return a.main.temp - b.main.temp;
        });

        displayForecastData(sortedData);
        $('#filtersContainer').toggleClass('hiddenFilters showFilters');
    });

    // Sorting temperatures in desscending order.
    $('#sortDescending').on('click', function () {
        const sortedData = JSON.parse(JSON.stringify(weatherData));

        sortedData.list.sort((a, b) => {
            return b.main.temp - a.main.temp;
        });

        displayForecastData(sortedData);
        $('#filtersContainer').toggleClass('hiddenFilters showFilters');
    });

    // Filter rainy days.
    $('#filterRain').on('click', function () {
        const filteredData = JSON.parse(JSON.stringify(weatherData));

        filteredData.list = filteredData.list.filter((row) => {
            return row.weather[0].description.includes('rain');
        });

        if (filteredData.list.length === 0) {
            alert('No rainy days found.');
        }
        else {
            displayForecastData(filteredData);
        }
        $('#filtersContainer').toggleClass('hiddenFilters showFilters');
    });

    // Filter day with highest temperature.
    $('#highestTemperature').on('click', function () {
        const highestDay = weatherData.list.reduce((maxDay, currentEntry) => {
            if (currentEntry.main && typeof currentEntry.main.temp === 'number') {
                if (currentEntry.main.temp > maxDay.main.temp) {
                    return currentEntry;
                }
                else {
                    return maxDay;
                }
            }
            return maxDay;
        }, weatherData.list[0]);

        const highestTempData = JSON.parse(JSON.stringify(weatherData));
        highestTempData.list = [highestDay];

        alert(`Highest Temperature: ${highestDay.main.temp}°C`);

        displayForecastData(highestTempData);
        $('#filtersContainer').toggleClass('hiddenFilters showFilters');
    });

    // Reset filters and display original data.
    $('#x').on('click', function () {
        displayForecastData(originalDataOfWeather);
        $('#filtersContainer').toggleClass('hiddenFilters showFilters');
    });

    // Get user's current location.
    getCurrentLocation();

    // Function to hide the loading spinner.
    function hideLoader() {
        setTimeout(function () {
            $('.loadingSpinner').addClass('hiddenSpinner');
            $('.loadingOverlay').addClass('hiddenOverlay');
        }, 1000);
    }

    // Function to show the loading spinner.
    function showLoader() {
        $('.loadingSpinner').removeClass('hiddenSpinner');
        $('.loadingOverlay').removeClass('hiddenOverlay');
    }

    // Function to extract city name from the user's input message of it exists.
    function getCityNameFromMessage(userInput) {
        let cityName = "";
        const userInputLower = userInput.toLowerCase();

        const inIndex = userInputLower.indexOf("in");
        const ofIndex = userInputLower.indexOf("of");

        if (inIndex !== -1 && (ofIndex === -1 || inIndex < ofIndex)) {
            // Get the city name after the word 'in'.
            cityName = userInput.slice(inIndex + 3).trim();
        }
        else if (ofIndex !== -1) {
            // Get the city name after the word 'of'.
            cityName = userInput.slice(ofIndex + 3).trim();
        }
        return cityName;
    }

    // CHATBOT IMPLEMENTATION.
    $('#sendButton').on('click', function () {
        const userInput = $('#userInput').val();
        if (userInput == "") {
            $('#chatMessages').append(`<div class="emptyInput"><i>Please Enter a Message</i></div>`);
            return;
        }

        $('#userInput').val('');
        $('#chatMessages').append(`<div class="ui">${userInput}</div>`);
        $('.ui').addClass('sentMessage');
        let value = "";

        // Detect what the user is asking for.
        if (userInput.toLowerCase().includes("weather")) {
            value = "today";
        }
        else if (userInput.toLowerCase().includes("temperature")) {
            value = "temperature";

            if (userInput.toLowerCase().includes("highest")) {
                value = "highest";
            }
            else if (userInput.toLowerCase().includes("lowest")) {
                value = "lowest";
            }
            else if (userInput.toLowerCase().includes("average")) {
                value = "average";
            }
        }
        else if (userInput.toLowerCase().includes("highest")) {
            value = "highest";
        }
        else if (userInput.toLowerCase().includes("lowest")) {
            value = "lowest";
        }
        else if (userInput.toLowerCase().includes("average")) {
            value = "average";
        }
        else if (userInput.toLowerCase().includes("condition")) {
            value = "condition";
        }
        else {
            handleOtherChatMessages(userInput);
            return;
        }

        let cityName = getCityNameFromMessage(userInput);

        if (cityName === "") {
            fetchWeatherDataChatBot(value);
        }
        else {
            fetchWeatherDataCityWiseChatBot(cityName, value);
        }
    });

    // Clear chat messages.
    $('#clearChat').on('click', function () {
        $('#chatMessages').empty();
    });

    // Function to fetch weather data for a specific city.
    function fetchWeatherDataCityWiseChatBot(cityName, value) {
        fetchWeatherByCityChatBot(cityName, value);
    }

    // Function to fetch weather data from the API using the city name.
    function fetchWeatherByCityChatBot(cityName, value) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        $.getJSON(url)
            .done(function (data) {
                displayWeatherDataChatBot(data, value);
            })
            .fail(function () {
                console.error('Error fetching weather data for the city.');
            })
            .always(function () {
                hideLoader();
            });
    }

    // Function to fetch weather data based on current location.
    function fetchWeatherDataChatBot(value) {
        getCurrentLocationChatBot(value);
    }

    // Function to get the user's current location.
    function getCurrentLocationChatBot(value) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lon = position.coords.longitude;

                defaultWeatherChatBot(lat, lon, value);
            }, function () {
                alert("Unable to retrieve your location.");
            });
        }
        else {
            alert("Geolocation is not supported.");
        }
    }

    // Function to fetch default weather data based on latitude and longitude.
    function defaultWeatherChatBot(lat, lon, value) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        $.getJSON(url)
            .done(function (data) {
                displayWeatherDataChatBot(data, value);
            })
            .fail(function () {
                console.error('Error fetching default weather data.');
            })
    }

    // Function to display weather data in the chat.
    function displayWeatherDataChatBot(data, value) {
        let weatherMessage;
        console.log(value);
        if (value === "temperature") {
            weatherMessage = `Current temperature in ${data.name}: ${data.main.temp.toFixed(2)} °C`;
        }
        else if (value === "condition") {
            const condition = data.weather[0].description;
            weatherMessage = `Current weather condition in ${data.name}: ${condition}`;
        }
        else if (value === "highest") {
            let maxTemp = data.main.temp_max;
            maxTemp = maxTemp.toFixed(2);
            weatherMessage = `Highest temperature in ${data.name} today: ${maxTemp} °C`;
        }
        else if (value === "lowest") {
            let minTemp = Math.round(data.main.temp_min);
            minTemp = minTemp.toFixed(2);
            weatherMessage = `Lowest temperature in ${data.name} today: ${minTemp} °C`;
        }
        else if (value === "average") {
            let avgTemp = (data.main.temp_max + data.main.temp_min) / 2;
            avgTemp = avgTemp.toFixed(2);
            weatherMessage = `Average temperature in ${data.name} today: ${avgTemp} °C`;
        }
        else {
            const temperature = data.main.temp.toFixed(2);
            const condition = data.weather[0].description;
            weatherMessage = `Current weather in ${data.name}: Temperature: ${temperature} °C, Condition: ${condition}`;
        }
        appendChatMessage(weatherMessage);
    }

    // Function to append a chat message to the chat window.
    function appendChatMessage(message) {
        $('#chatMessages').append(`<div class="received">${message}</div>`);
        $('.received').addClass('receiveMessage');
    }

    // Function to handle other types of user messages that don't match predefined categories.
    function handleOtherChatMessages(userInput) {
        const geminiApiKey = `AIzaSyAd_iz9v-YQA-Tr0wfko4so6kbW6hSh0Vs`;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;

        // Use the Fetch API to send a POST request to the Gemini API.
        fetch(apiUrl, {
            method: "POST",  // Specify the request method as POST.
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // Create the body of the request as a JSON object.
                contents: [
                    {
                        parts: [
                            {
                                // Include the user's input in the request body.
                                text: userInput
                            }
                        ]
                    }
                ]
            })
        })
            // Handle the response from the API.
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Check if the API returned valid data.
                if (data && data.candidates && data.candidates.length > 0) {
                    const botResponse = data.candidates[0].content.parts[0].text;
                    $('#chatMessages').append(`<div class="bot">${botResponse}</div>`);
                    $('.bot').addClass('receiveMessage');
                }
                else {
                    $('#chatMessages').append(`<div class="bot">Sorry, I couldn't process your request.</div>`);
                    $('.bot').addClass('receivedMessage');
                }
            })
            .catch(() => {
                $('#chatMessages').append(`<div class="bot">Sorry, I couldn't process your request.</div>`);
                $('.bot').addClass('receivedMessage');
            });
    }

    // Toggle filters functionality for showing/hiding filter options.
    $('#toggleFilters').on('click', function () {
        $('#filtersContainer').toggleClass('hiddenFilters showFilters');
    });
});
