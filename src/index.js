import { format } from 'date-fns'
import './style.css'

const API_KEY_LOCATION = "bf4f379df284cb438eb676f583a170c3"
const searchForm = document.getElementById('searchForm')
const locationInput = document.getElementById('locationInput')
const updateBtn = document.querySelector('.reload-container')
const message = document.querySelector('.message')
let locationName

searchForm.addEventListener('submit', handleSearch)
locationInput.oninput = () => clearMessage()
document.addEventListener('DOMContentLoaded', () => handleSearch())
updateBtn.onclick = (e) => handleSearch(e)

async function handleSearch(event) {
    if (event === undefined) {
        locationName = 'Rome, Italy'
    } else {
        event.preventDefault()
        locationName = locationInput.value
    }
    if (!locationName) return;

    try {
        fetchData(locationName)
    } catch (error) {
        displayLocationError()
    }
    searchForm.reset()
}

async function fetchData(locationName) {
    let locationData
    let locationWeather
    try {
        locationData = await fetchLocationData(locationName)
        let latitude = locationData[0].lat;
        let longitude = locationData[0].lon;
        locationWeather = await fetchLocationWeather(latitude, longitude)
    } catch (error) {
        displayDataError()
    }
    renderCurrentWeather(locationData[0], locationWeather)
    renderForecast(locationWeather)
}

async function fetchLocationData(city) {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY_LOCATION}`)
        const coordinates = await response.json()
        return coordinates
    } catch (error) {
        console.log(error)
    }
}

async function fetchLocationWeather(lat, lon) {
    let URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&forecast_days=4&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&hourly=relativehumidity_2m&timezone=auto&models=best_match`
    try {
        const response = await fetch(URL)
        const weather = await response.json()
        return weather   
    } catch (error) {
        console.log(error)
    }
}

function renderCurrentWeather(data, weatherObj) {
    const cityDiv = document.querySelector('.city-div')
    const dateDiv = document.querySelector('.date-div')
    const wwDiv = document.querySelector('.ww-description-div')
    const currentTempDiv = document.querySelector('.current-temp-div')
    const wwImg = document.querySelector('.ww-img')
    const tMax = document.querySelector('.t-max')
    const tMin = document.querySelector('.t-min')
    const windSpeed = document.querySelector('.wind-speed')
    const windDir = document.querySelector('.wind-direction')
    const humidity = document.querySelector('.humidity')


    cityDiv.textContent = `${data.name}, ${data.country}`
    let dateFormatted = format(new Date(weatherObj.current_weather.time), `EEE, do LLL yyy, hh:mm aaa`)
    dateDiv.textContent = dateFormatted
    
    currentTempDiv.textContent = `${weatherObj.current_weather.temperature} °C`

    let currentWw = renderWW(weatherObj.current_weather.weathercode, weatherObj.current_weather.is_day)
    wwImg.src = currentWw.url
    wwDiv.textContent = currentWw.text
    
    tMax.textContent = `${weatherObj.daily.temperature_2m_max[0]} °C`
    tMin.textContent = `${weatherObj.daily.temperature_2m_min[0]} °C`
    windSpeed.textContent = `${weatherObj.current_weather.windspeed} Km/h`
    windDir.textContent = getWindDirection(weatherObj.current_weather.winddirection)
    humidity.textContent = `${getRelativeHumidity(weatherObj.hourly.time, weatherObj.hourly.relativehumidity_2m, weatherObj.current_weather.time)} %`
}

function renderWW(weatherCode, isDay) {
    let ww = {
        url: "",
        text: ""
    }

    if (isDay) {
        switch(weatherCode) {
            case 0:
                ww.text = 'Clear sky'
                ww.url = "assets/icons/wi-day-sunny.svg"
                return ww
            case 1:
                ww.text = 'Mainly clear'
                ww.url = "assets/icons/wi-day-sunny-overcast.svg"
                return ww
            case 2:
                ww.text = 'Partly cloudy'
                ww.url = "assets/icons/wi-day-cloudy.svg"
                return ww
            case 3:
                ww.text = 'Overcast'
                ww.url = "assets/icons/wi-cloudy.svg"
                return ww
            case 45:
            case 48:
                ww.text = 'Fog'
                ww.url = "assets/icons/wi-fog.svg"
                return ww
            case 51:
                ww.text = 'Light drizzle'
                ww.url = "assets/icons/wi-day-sprinkle.svg"
                return ww
            case 53:
                ww.text = 'Moderate drizzle'
                ww.url = "assets/icons/wi-day-sprinkle.svg"
                return ww
            case 55:
                ww.text = 'Dense drizzle'
                ww.url = "assets/icons/wi-day-sprinkle.svg"
                return ww
            case 56:
            case 57:
                ww.text = 'Freezing drizzle'
                ww.url = "assets/icons/wi-day-sprinkle.svg"
                return ww
            case 61:
                ww.text = 'Slight rain'
                ww.url = "assets/icons/wi-day-rain.svg"
                return ww
            case 63:
                ww.text = 'Moderate rain'
                ww.url = "assets/icons/wi-day-rain.svg"
                return ww
            case 65:
                ww.text = 'Heavy rain'
                ww.url = "assets/icons/wi-day-rain.svg"
                return ww
            case 66:
            case 67:
                ww.text = 'Freezing rain'
                ww.url = "assets/icons/wi-day-rain.svg"
                return ww
            case 71:
                ww.text = 'Slight snow'
                ww.url = "assets/icons/wi-day-snow.svg"
                return ww
            case 73:
                ww.text = 'Moderate snow'
                ww.url = "assets/icons/wi-day-snow.svg"
                return ww
            case 75:
                ww.text = 'Heavy snow'
                ww.url = "assets/icons/wi-day-snow.svg"
                return ww
            case 77:
                ww.text = 'Snow grains'
                ww.url = "assets/icons/wi-day-snow.svg"
                return ww
            case 80:
                ww.text = 'Slight rain showers'
                ww.url = "assets/icons/wi-day-showers.svg"
                return ww
            case 81:
                ww.text = 'Moderate rain showers'
                ww.url = "assets/icons/wi-day-showers.svg"
                return ww
            case 82:
                ww.text = 'Violent rain showers'
                ww.url = "assets/icons/wi-day-showers.svg"
                return ww
            case 85:
                ww.text = 'Slight snow showers'
                ww.url = "assets/icons/wi-day-snow-wind.svg"
                return ww
            case 86:
                ww.text = 'Heavy snow showers'
                ww.url = "assets/icons/wi-day-snow-wind.svg"
                return ww
            case 95:
                ww.text = 'Thunderstorm'
                ww.url = "assets/icons/wi-thunderstorm.svg"
                return ww
            case 96:
                ww.text = 'Thunderstorm with slight hail'
                ww.url = "assets/icons/wi-thunderstorm.svg"
                return ww
            case 99:
                ww.text = 'Thunderstorm with heavy hail'
                ww.url = "assets/icons/wi-hail.svg"
                return ww    
        } 
    } else {
        switch(weatherCode) {
            case 0:
                ww.text = 'Clear sky'
                ww.url = "assets/icons/wi-night-clear.svg"
                return ww
            case 1:
                ww.text = 'Mainly clear'
                ww.url = "assets/icons/wi-night-partly-cloudy.svg"
                return ww
            case 2:
                ww.text = 'Partly cloudy'
                ww.url = "assets/icons/wi-night-cloudy.svg"
                return ww
            case 3:
                ww.text = 'Overcast'
                ww.url = "assets/icons/wi-cloudy.svg"
                return ww
            case 45:
            case 48:
                ww.text = 'Fog'
                ww.url = "assets/icons/wi-fog.svg"
                return ww
            case 51:
                ww.text = 'Light drizzle'
                ww.url = "assets/icons/wi-night-sprinkle.svg"
                return ww
            case 53:
                ww.text = 'Moderate drizzle'
                ww.url = "assets/icons/wi-night-sprinkle.svg"
                return ww
            case 55:
                ww.text = 'Dense drizzle'
                ww.url = "assets/icons/wi-night-sprinkle.svg"
                return ww
            case 56:
            case 57:
                ww.text = 'Freezing drizzle'
                ww.url = "assets/icons/wi-night-sprinkle.svg"
                return ww
            case 61:
                ww.text = 'Slight rain'
                ww.url = "assets/icons/wi-night-rain.svg"
                return ww
            case 63:
                ww.text = 'Moderate rain'
                ww.url = "assets/icons/wi-night-rain.svg"
                return ww
            case 65:
                ww.text = 'Heavy rain'
                ww.url = "assets/icons/wi-night-rain.svg"
                return ww
            case 66:
            case 67:
                ww.text = 'Freezing rain'
                ww.url = "assets/icons/wi-night-rain.svg"
                return ww
            case 71:
                ww.text = 'Slight snow'
                ww.url = "assets/icons/wi-night-snow.svg"
                return ww
            case 73:
                ww.text = 'Moderate snow'
                ww.url = "assets/icons/wi-night-snow.svg"
                return ww
            case 75:
                ww.text = 'Heavy snow'
                ww.url = "assets/icons/wi-night-snow.svg"
                return ww
            case 77:
                ww.text = 'Snow grains'
                ww.url = "assets/icons/wi-night-snow.svg"
                return ww
            case 80:
                ww.text = 'Slight rain showers'
                ww.url = "assets/icons/wi-night-showers.svg"
                return ww
            case 81:
                ww.text = 'Moderate rain showers'
                ww.url = "assets/icons/wi-night-showers.svg"
                return ww
            case 82:
                ww.text = 'Violent rain showers'
                ww.url = "assets/icons/wi-night-showers.svg"
                return ww
            case 85:
                ww.text = 'Slight snow showers'
                ww.url = "assets/icons/wi-night-snow-wind.svg"
                return ww
            case 86:
                ww.text = 'Heavy snow showers'
                ww.url = "assets/icons/wi-night-snow-wind.svg"
                return ww
            case 95:
                ww.text = 'Thunderstorm'
                ww.url = "assets/icons/wi-thunderstorm.svg"
                return ww
            case 96:
                ww.text = 'Thunderstorm with slight hail'
                ww.url = "assets/icons/wi-thunderstorm.svg"
                return ww
            case 99:
                ww.text = 'Thunderstorm with heavy hail'
                ww.url = "assets/icons/wi-hail.svg"
                return ww    
        }

    }
}

function displayLocationError() {
    message.textContent = 'Location not found.'
    message.style.visibility = "visible"
}

function displayDataError() {
    message.textContent = 'Data not available for this location.'
    message.style.visibility = "visible"
}

function clearMessage() {
    message.style.visibility = "hidden"
}

function getWindDirection(degrees) {
    if (0 < degrees && degrees < 90) return 'NE'
    else if (90 < degrees && degrees  < 180) return 'SE'
    else if (180 < degrees && degrees < 270) return 'SW'
    else if (270 < degrees && degrees < 360) return 'NW'
    else if (degrees === 0 || degrees === 360) return 'N'
    else if (degrees === 90) return 'E'
    else if (degrees === 180) return 'S'
    else if (degrees === 270) return 'W'
}

function getRelativeHumidity(timeArray, humidityData, currentTime) {
    let index = timeArray.findIndex(time => time === currentTime)
    return humidityData[index]
}

function renderForecast(weatherObj) {
    clearContent('.days-container')
    let maxTempArray = weatherObj.daily.temperature_2m_max
    let minTempArray = weatherObj.daily.temperature_2m_min
    let timeArray = weatherObj.daily.time
    let wwArray = weatherObj.daily.weathercode

    for (let i = 1; i < 4; i++) {
        createDivs(maxTempArray[i], minTempArray[i], timeArray[i], wwArray[i])
    }
}

function createDivs(maxT, minT, day, ww) {
    const dayDiv = document.createElement('div')
    dayDiv.classList.add('day')

    const dayNameDiv = document.createElement('h3')
    dayNameDiv.classList.add('day-name')
    let dateFormatted = format(new Date(day), 'iii d')
    dayNameDiv.textContent = dateFormatted

    const imgDiv = document.createElement('img')
    imgDiv.classList.add('default-icon')
    let currentWw = renderWW(ww, true)
    imgDiv.src = currentWw.url

    const maxTempDiv = document.createElement('h3')
    maxTempDiv.classList.add('t-max')
    maxTempDiv.textContent = `${maxT} °C`

    const minTempDiv = document.createElement('p')
    minTempDiv.classList.add('t-max')
    minTempDiv.textContent = `${minT} °C`

    dayDiv.appendChild(dayNameDiv)
    dayDiv.appendChild(imgDiv)
    dayDiv.appendChild(maxTempDiv)
    dayDiv.appendChild(minTempDiv)
    
    const daysContainer = document.querySelector('.days-container')
    daysContainer.appendChild(dayDiv)
}

function clearContent(divClass) {
    const divToClear = document.querySelector(divClass)
    divToClear.innerHTML = ''
}