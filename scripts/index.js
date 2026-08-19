// select elements to edit
const year = document.querySelector("#currentyear");
let windchill =  document.querySelector("#windchill");
let tempID = document.querySelector("#temperature");
let windID = document.querySelector("#wind");
let cityName = document.querySelector("#cityName");
let condition = document.querySelector("#condition");

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
        tempID.innerHTML = `${data.temperature}<sup>0</sup>c`;
        windID.innerHTML = `${data.windSpeed} km/h`;
        windchill.innerHTML = chill !== "N/A" ? `${chill}<sup>0</sup>C`: "N/A";
        condition.innerHTML = data.description;

    }
    catch(err){
        windchill.textContent = "Unable to fetch weather data";
    }
}

loadWeather()
year.textContent = new Date().getFullYear();
