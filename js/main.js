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
});
