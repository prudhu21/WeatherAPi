const apiKey = "09a81572320966b132c6d9307aac3bb4";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

let searchInput = document.getElementById("search_input");
let searchButton = document.getElementById("search_btn");

let weatherData = async (lat, lon) => {
    let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    let response = await fetch(forecastApiUrl);
    let data = await response.json();
    console.log(data);

    let forecastContainer = document.getElementById("Future_data").querySelector(".row");
    forecastContainer.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        let dayData = data.list[i * 8]; 
        let temp = Math.round(dayData.main.temp);
        let description = dayData.weather[0].description;
        let iconCode = dayData.weather[0].icon;
        let dayName = new Date(dayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });

        forecastContainer.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
                <div class="card future-weather-card mx-auto">
                    <div class="card-body text-center">
                        <h5 class="card-title">${dayName}</h5>
                        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon" class="weather-icon mb-2">
                        <p class="card-text">${temp}°C</p>
                        <p class="card-text">${description}</p>
                    </div>
                </div>
            </div>`;
    }
};

async function check(city) {
    let response=await fetch(`${apiUrl} ${city}&appid=${apiKey}`);
    let data=await response.json();

    document.querySelector('.card-title').innerHTML = data.name;

        let temperature_value = Math.round(data.main.temp);
        document.querySelector('.temp_display').innerHTML = `${temperature_value}°C`;
        document.querySelector('.card-text').innerHTML = data.weather[0].description;

        let weatherImg = document.getElementById("weatherImg");
        let videoBg=document.getElementById("bgVideo");

        if(temperature_value<-15 && temperature_value>-5){
            weatherImg.src="storm.png";
            videoBg.src="images/stormBg.png"
        }
        else if (temperature_value < 0) {
            weatherImg.src = "fullrain.png";
            videoBg.src="images/fullrainBg.mp4"
        } else if (temperature_value >= 0 && temperature_value < 10) {
            weatherImg.src = "rainy.png";
            videoBg.src="images/bg-video.mp4"
        } else if (temperature_value >= 10 && temperature_value < 20) {
            weatherImg.src = "cloudy.png";
            videoBg.src="images/cloudyBg.mp4"
        } else {
            weatherImg.src = "sun.png";
            videoBg.src="images/clearskyBg.mp4";
        }

        let degree_celsius = document.getElementById("degree_celsius");
        degree_celsius.onclick = () => {
            document.querySelector('.temp_display').innerHTML = `${temperature_value}°C`;
        };

        let fahrenheit = document.getElementById("fahreinheit");
        fahrenheit.onclick = () => {
            let temperature_fahrenheit = (temperature_value * 1.8) + 32;
            document.querySelector('.temp_display').innerHTML = `${temperature_fahrenheit.toFixed(2)}°F`;
        };

    
    await weatherData(data.coord.lat, data.coord.lon);
    
}

searchButton.addEventListener("click", async (e) => {
    e.preventDefault();
    let city = searchInput.value.trim();
    if(!city){
        alert("Please enter a city");
        return;
    }try{
        await check(city);
    }catch{
        alert("Failed to fetch weather data.Please check the city name");
    }
});