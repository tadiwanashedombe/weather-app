// select elements to edit
const year = document.querySelector("#currentyear");
const cityName = document.querySelector("#cityName");
const weatherIcon = document.querySelector("#weather-icon");
const description = document.querySelector("#description");
const tempID = document.querySelector("#temperature");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const pressure = document.querySelector("#pressure");
const uv = document.querySelector("#uv");
const windID = document.querySelector("#wind");
const windchill = document.querySelector("#windchill");
const forecastContainer = document.querySelector("#forecast");
const searchForm = document.querySelector("#city-search");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const weatherError = document.querySelector("#weather-error");
const weatherStatus = document.querySelector("#weather-status");

function buildWeatherIconUrl(icon) {
    if (!icon) {
        return "";
    }

    return icon.startsWith("//") ? `https:${icon}` : icon;
}

function renderForecast(days = []) {
    forecastContainer.innerHTML = "";

    if (!Array.isArray(days) || !days.length) {
        const message = document.createElement("p");
        message.className = "forecast-empty";
        message.textContent = "Forecast unavailable";
        forecastContainer.appendChild(message);
        return;
    }

    days.slice(0, 7).forEach((day) => {
        const item = document.createElement("article");
        item.className = "forecast-item";
        const dayName = document.createElement("div");
        dayName.className = "forecast-day";
        dayName.textContent = day.day_name || day.date || "Forecast";

        const icon = document.createElement("img");
        icon.className = "forecast-icon";
        icon.src = buildWeatherIconUrl(day.icon);
        icon.alt = day.description || "Forecast";

        const forecastDescription = document.createElement("div");
        forecastDescription.className = "forecast-desc";
        forecastDescription.textContent = day.description || "Forecast";

        const temperatures = document.createElement("div");
        temperatures.className = "forecast-temp";
        temperatures.textContent = `${day.maxtemp_c}° / ${day.mintemp_c}°`;

        item.append(dayName, icon, forecastDescription, temperatures);

        forecastContainer.appendChild(item);
    });
}

function calculateWindChill (temp, windSpeed){
    if(temp <= 10 && windSpeed > 4.8){
        const windchill = 13.12 + 0.6215*temp-11.37*Math.pow(windSpeed,0.16)+0.3965 * temp *Math.pow(windSpeed,0.16)

        return windchill.toFixed(1);
    } else{
        return "N/A";
    }   
}
async function loadWeather(city = "Harare") {
    const requestedCity = city.trim();
    if (!requestedCity) {
        weatherError.textContent = "Enter a city name to search.";
        weatherError.hidden = false;
        cityInput.focus();
        return;
    }

    weatherError.textContent = "";
    weatherError.hidden = true;
    weatherStatus.textContent = `Loading weather for ${requestedCity}…`;
    searchButton.disabled = true;

    try {
        let response;
        try {
            response = await fetch(`weather.php?city=${encodeURIComponent(requestedCity)}`);
        } catch {
            throw new Error("Could not connect to the weather service. Check your connection and try again.");
        }

        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("The server returned an unreadable response. Please try again.");
        }

        if (!response.ok || data.error) {
            throw new Error(data.error || "Weather request failed. Please try again.");
        }

        const chill = calculateWindChill(data.temperature, data.windSpeed);
        
        cityName.textContent = data.city;

        weatherIcon.src = buildWeatherIconUrl(data.weather_icon);
        description.textContent = data.description;
        tempID.textContent = `${data.temperature}°C`;

        feelsLike.textContent = `${data.feels_like}°C`;
        humidity.textContent = `${data.humidity}%`;
        pressure.textContent = `${data.pressure} hPa`;
        uv.textContent = data.uv;
        windID.textContent = `${data.windSpeed} km/h`;
        windchill.textContent = chill !== "N/A" ? `${chill}°C`: "N/A";
        renderForecast(data.forecast || []);
        weatherStatus.textContent = "";
    } catch (error) {
        weatherError.textContent = error.message || "Unable to fetch weather data. Please try again.";
        weatherError.hidden = false;
        weatherStatus.textContent = "";
    } finally {
        searchButton.disabled = false;
    }
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loadWeather(cityInput.value);
});

const initialCity = new URLSearchParams(window.location.search).get("city")?.trim() || "Harare";
cityInput.value = initialCity;
loadWeather(initialCity);
year.textContent = new Date().getFullYear();
