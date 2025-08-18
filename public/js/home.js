const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const card = document.getElementById("weatherCard");

weatherForm.addEventListener("submit", async e => {
    e.preventDefault();

    const city = cityInput.value;

    try {
        const weatherData = await getWeatherData(city);
        displayWeatherData(weatherData);
    } catch (error) {
        window.alert(error)
    }
})

async function getWeatherData(city){
    try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        if(!response.ok){
            throw new Error("Error fetching cities");
        }
        const data = await response.json()
        return data
    } catch (error) {
        displayError(error)
    }
}

function displayWeatherData(data){
    try {
        const {
            name: city,
            main: {temp, feels_like, humidity},
            clouds: {all},
            weather: [{main, description}],
            visibility: visibility,
            wind: {speed}
        } = data;

        document.getElementById("cityName").textContent = city;
        document.getElementById("temp").textContent = temp;
        document.getElementById("weatherMain").textContent = main;
        document.getElementById("weatherDescription").textContent = description;
        document.getElementById("feelsLike").textContent = feels_like;
        document.getElementById("humidity").textContent = humidity;
        document.getElementById("clouds").textContent = all;

        const mps = speed;     
        const kmph = mps * 3.6; 
        document.getElementById("windSpeed").textContent = kmph;

        const mtrs = visibility;
        const kmtrs = mtrs/1000;
        document.getElementById("visibility").textContent = kmtrs;
    } catch (error) {
        
    }
}

function displayError(error){
    window.alert(error.message || "Something went wrong while fetching weather data.");
}