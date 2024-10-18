$(document).ready(function () {
    showLoader();

    // API key for Gemini API.
    const apiKey = '6beaceb65aa4ee60624314ea49d64c11';
    let currentTemperatureCelsius = null;

    function getCurrrentLocation() {

        // To heck if the browser supports geolocation.
        if (navigator.geolocation) {

            // Get the current position of the user.
            navigator.geolocation.getCurrentPosition(function (position) {

                // From position object, get latitude and longitude of user's position.
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                //defaultWeather(33.6844, 73.0479);
                defaultWeather(lat, lon);
            });
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    getCurrrentLocation();

    function defaultWeather(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        // Make a JSON request to the OpenWeatherMap API.
        $.getJSON(url)
            .done(function (data) {
                const cityName = data.name;
                console.log(cityName);

                displayTheFetchedWeatherData(data);
                fetchChartData(cityName, apiKey);
            })
            .fail(function () {
                console.error('Error fetching default weather data.');
            })
            .always(function () {
                hideLoader();
            });;;
    }

    // Handles click event for the search button to fetch weather data by city name.
    $('#searchButton').on('click', function () {
        const cityName = $('#searchInput').val();

        showLoader();

        getWeatherByCity(cityName);
    });

    // Fetches weather data for a specific city by name.
    function getWeatherByCity(cityName) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        $.getJSON(url)
            .done(function (data) {
                displayTheFetchedWeatherData(data);
                fetchChartData(cityName, apiKey);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching weather data:', textStatus, errorThrown);
            })
            .always(function () {
                hideLoader();
            });;;
    }

    // Displays the fetched weather data on the webpage.
    function displayTheFetchedWeatherData(data) {
        const cityName = data.name;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const weatherDescription = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        currentTemperatureCelsius = data.main.temp;

        $('#cityName').text(cityName);
        $('#tempValue').text(temperature);
        $('#temperatureUnit').text('C');
        $('#humidity').text(humidity + '%');
        $('#windspeed').text(windSpeed + ' km/h');
        $('#weatherDescription').text(weatherDescription);
        $('#weatherIconImage').attr('src', iconUrl);
        $('#weatherIconImage').attr('alt', weatherDescription);

        changeWidgetBackgroundImage(weatherDescription);
    }

    // Changes the background image of the widget based on weather description.
    function changeWidgetBackgroundImage(weatherDescription) {
        const widget = $('#weatherContentCity');
        widget.removeClass('clear-sky cloudy rainy sunny hazey snowy thunderstorm default-weather');

        const descriptionInLowerCase = weatherDescription.toLowerCase();

        if (descriptionInLowerCase.includes("clear")) {
            widget.addClass('clear-sky');
            darkText();
        }
        else if (descriptionInLowerCase.includes("cloud")) {
            widget.addClass('cloudy');
            lightText();
        }
        else if (descriptionInLowerCase.includes("rain") || descriptionInLowerCase.includes("drizzle")) {
            widget.addClass('rainy');
            lightText();
        }
        else if (descriptionInLowerCase.includes("sun")) {
            widget.addClass('sunny');
            darkText();
        }
        else if (descriptionInLowerCase.includes("haze") || descriptionInLowerCase.includes("mist") || descriptionInLowerCase.includes("fog")) {
            widget.addClass('hazey');
            lightText();
        }
        else if (descriptionInLowerCase.includes("snow")) {
            widget.addClass('snowy');
            darkText();
        }
        else if (descriptionInLowerCase.includes("thunderstorm")) {
            widget.addClass('thunderstorm');
            lightText();
        }
        else if (descriptionInLowerCase.includes("smoke")) {
            widget.addClass('smokey');
            lightText();
        }
        else {
            widget.addClass('default-weather');
            darkText();
        }
    }

    // Sets text color to light for better visibility on dark backgrounds.
    function lightText() {
        $('#cityName').css('color', 'white');
        $('#tempValue').css('color', 'white');
        $('#temperatureUnit').css('color', 'white');
        $('#humidity').css('color', 'white');
        $('#windspeed').css('color', 'white');
        $('#weatherDescription').css('color', 'white');
        $('.fas').css('color', 'white');
        $('#humidityLabel').css('color', 'white');
        $('#windLabel').css('color', 'white');
        $('#desLabel').css('color', 'white');
        $('.temperature').css('color', 'white');
    }

    // Sets text color to dark for better visibility on light backgrounds.
    function darkText() {
        $('#cityName').css('color', 'black');
        $('#tempValue').css('color', 'black');
        $('#temperatureUnit').css('color', 'black');
        $('#humidity').css('color', 'black');
        $('#windspeed').css('color', 'black');
        $('#weatherDescription').css('color', 'black');
        $('#humidityLabel').css('color', 'black');
        $('.fas').css('color', 'black');
        $('#windLabel').css('color', 'black');
        $('#desLabel').css('color', 'black');
        $('.temperature').css('color', 'black');
    }

    // Fetches weather data for charts based on city name.
    function fetchChartData(cityName, apiKey) {
        const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

        $.getJSON(geoApiUrl, function (geoData) {
            if (geoData.length > 0) {
                const lat = geoData[0].lat;
                const lon = geoData[0].lon;

                const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

                $.getJSON(weatherApiUrl, function (weatherData) {
                    const dailyTemperatures = []; // Array to store daily temperatures.
                    const weatherConditions = {}; // Object to store counts of weather conditions.
                    const dates = [];  // Array to store dates for the forecast.

                    // Iterate over the list of weather data. (contains data for 3-hour intervals).
                    $.each(weatherData.list, function (index, item) {

                        // Only consider data points that correspond to daily forecasts (every 8th item).
                        if (index % 8 === 0) {
                            var date = new Date(item.dt * 1000).toLocaleDateString();
                            dates.push(date);

                            var temperature = item.main.temp;
                            dailyTemperatures.push(temperature);

                            var condition = item.weather[0].main;

                            // Count the occurrences of each weather condition.
                            if (weatherConditions[condition]) {
                                weatherConditions[condition] += 1;
                            }
                            else {
                                weatherConditions[condition] = 1;
                            }
                        }
                    });

                    createCharts(dailyTemperatures, weatherConditions, dates);
                });
            }
            else {
                alert("City not found.");
            }
        });
    }

    let barChart;
    let doughnutChart
    let lineChart;

    // Creates charts using fetched temperature data and weather conditions.
    function createCharts(dailyTemperatures, weatherConditions, dates) {
        if (barChart) {
            barChart.destroy();
        }
        if (doughnutChart) {
            doughnutChart.destroy();
        }
        if (lineChart) {
            lineChart.destroy();
        }

        createBarChart(dailyTemperatures, dates);
        createDoughnutChart(weatherConditions);
        createLineChart(dailyTemperatures, dates);
    }

    // Creates a bar chart displaying daily temperatures.
    function createBarChart(dailyTemperatures, dates) {
        var ctx = $('#barChart');
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Temperatures (°C)',
                    data: dailyTemperatures,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animation: {
                        delay: 100
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Creates a doughnut chart displaying daily conditions.
    function createDoughnutChart(weatherConditions) {
        var ctx = $('#doughnutChart');
        doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(weatherConditions),
                datasets: [{
                    label: 'Weather Conditions',
                    data: Object.values(weatherConditions),
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                    ],
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 0,
                }]
            },
            options: {
                animation: {
                    delay: 100
                }
            }
        });
    }

    // Creates a line chart displaying daily temperatures.
    function createLineChart(dailyTemperatures, dates) {
        var ctx = $('#lineChart');
        lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Temperature Changes (°C)',
                    data: dailyTemperatures,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                reponsive: true,
                maintainAspectRatio: false,
                animations: {
                    y: {
                        easing: 'easeInOutElastic',
                        from: (ctx) => {
                            if (ctx.type === 'data') {
                                if (ctx.mode === 'default' && !ctx.dropped) {
                                    ctx.dropped = true;
                                    return 0;
                                }
                            }
                        }
                    }
                },
            }
        });
    }
    // Function to update the temperature display based on the selected unit (Celsius or Fahrenheit).
    function updateTemperature(unit) {
        let temperatureDisplay = $('#tempValue');
        let temperatureUnit = $('#temperatureUnit');
        let currentTemperatureFahrenheit;

        if (unit === 'C') {
            temperatureDisplay.text(currentTemperatureCelsius.toFixed(2));
            temperatureUnit.text('C');
            $('#celsius').css('background-color', '#B0C4DE');
            $('#fahrenheit').css('background-color', 'white');
        }
        else {
            currentTemperatureFahrenheit = (currentTemperatureCelsius * 9 / 5) + 32;
            temperatureDisplay.text(currentTemperatureFahrenheit.toFixed(2));
            temperatureUnit.text('F');
            $('#celsius').css('background-color', 'white');
            $('#fahrenheit').css('background-color', '#B0C4DE');
        }
    }

    // Event listener for the Celsius button click.
    $('#celsius').on('click', function () {
        updateTemperature('C');
    });

    // Event listener for the Fahrenheit button click.
    $('#fahrenheit').on('click', function () {
        updateTemperature('F');
    });

    // Initial call to set the temperature display to Celsius.
    updateTemperature('C');

    // Function to hide the loading spinner and overlay after a delay.
    function hideLoader() {
        setTimeout(function () {
            $('.loadingSpinner').addClass('hiddenSpinner');
            $('.loadingOverlay').addClass('hiddenOverlay');
        }, 1000);
    }

    // Function to show the loading spinner and overlay.
    function showLoader() {
        $('.loadingSpinner').removeClass('hiddenSpinner');
        $('.loadingOverlay').removeClass('hiddenOverlay');
    }
});
