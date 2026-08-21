// select elements to edit
const year = document.querySelector("#currentyear");

let cityName = document.querySelector("#cityName");

let weatherIcon = document.querySelector("#weather-icon");
let description = document.querySelector("#description");
let tempID = document.querySelector("#temperature");

let feelsLike = document.querySelector("#feels-like");
let humidity = document.querySelector("#humidity");
let pressure = document.querySelector("#pressure");
let uv = document.querySelector("#uv");
let windID = document.querySelector("#wind");
let windchill =  document.querySelector("#windchill");

function calculateWindChill (temp, windSpeed){
    if(temp <= 10 && windSpeed > 4.8){
        const windchill = 13.12 + 0.6215*temp-11.37*Math.pow(windSpeed,0.16)+0.3965 * temp *Math.pow(windSpeed,0.16)

        return windchill.toFixed(1);
    } else{
        return "N/A";
    }   
}
async function loadWeather(city = "Harare") {
    try{
        const response = await fetch(`weather.php?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (data.error) {
            windchill.textContent = "Error fetching weather data";

            return;
        }

        const chill = calculateWindChill(data.temperature, data.windSpeed);
        
        cityName.innerHTML = data.city;

        weatherIcon.src = data.weather_icon;
        description.innerHTML = data.description;
        tempID.innerHTML = `${data.temperature}&deg;C`;

        feelsLike.innerHTML = `${data.feels_like}&deg;C`;
        humidity.innerHTML = `${data.humidity}%`;
        pressure.innerHTML = `${data.pressure} hPa`;
        uv.innerHTML = data.uv;
        windID.innerHTML = `${data.windSpeed} km/h`;
        windchill.innerHTML = chill !== "N/A" ? `${chill}&deg;C`: "N/A";
    }
    catch(err){
        windchill.textContent = "Unable to fetch weather data";
    }
}

loadWeather()
year.textContent = new Date().getFullYear();
