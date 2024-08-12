document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fetch-weather').addEventListener('click', fetchWeather);

    async function fetchWeather() {
        const city = document.getElementById('city-input').value;
        if (city) {
            try {
                
                const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
                const geoData = await geoResponse.json();

                if (!geoData.results || geoData.results.length === 0) {
                    throw new Error('City not found');
                }

                const { latitude, longitude } = geoData.results[0]; // Chat gpt heeft dit gefxt omdat linken niet lukte

            
                const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
                const weatherData = await weatherResponse.json();

                console.log(weatherData); 
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        } else {
            alert('Please enter a city name.');
        }
    }
});document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fetch-weather').addEventListener('click', fetchWeather);
    document.getElementById('city-dropdown').addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            const city = event.target.getAttribute('data-city');
            document.getElementById('city-input').value = city;
            fetchWeather();
        }
    });

    async function fetchWeather() {
        const city = document.getElementById('city-input').value;
        if (city) {
            try {
                // Fetch coordinates based on city name
                const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
                const geoData = await geoResponse.json();

                if (!geoData.results || geoData.results.length === 0) {
                    throw new Error('City not found');
                }

                const { latitude, longitude } = geoData.results[0];

                // Fetch weather data based on coordinates
                const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
                const weatherData = await weatherResponse.json();

                displayWeather(weatherData, city);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                document.getElementById('weather-container').innerHTML = `<p class="error">Failed to load weather data. Please try again later.</p>`;
            }
        } else {
            alert('Please enter a city name.');
        }
    }

    function displayWeather(weatherData, city) {
        const weatherContainer = document.getElementById('weather-container');
        weatherContainer.innerHTML = ''; // Clear previous data

        const temperature = weatherData.hourly.temperature_2m[0];
        const time = new Date(weatherData.hourly.time[0]).toLocaleString(); // Correctly format the time

        const weatherHtml = `
            <h2>${city}</h2>
            <p>Time: ${time}</p>
            <p>Temperature: ${temperature.toFixed(1)}°C</p>
        `;

        weatherContainer.innerHTML = weatherHtml;

        // Update chart
        updateChart(weatherData.hourly);
    }

    function updateChart(hourlyData) {
        const ctx = document.getElementById('weather-chart').getContext('2d');
        const temperatures = hourlyData.temperature_2m;
        const times = hourlyData.time.map(time => new Date(time).toLocaleString()); // Correctly format the times

        // Remove existing chart if it exists
        if (window.chartInstance) {
            window.chartInstance.destroy();
        }

        window.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: times,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatures,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
});

