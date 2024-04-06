const axios = require("axios");
const { WEATHER_API_KEY } = process.env;

async function getWeather(model: any) {
  try {
    const { city } = model; // Get city from query parameter
    //   const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`;
    const apiUrl = `https://api.weatherapi.com/v1/current.json?q=${city}&key=${WEATHER_API_KEY}`;
    const response = await axios.get(apiUrl);
    //const weatherData = response.data;
    const weatherData = {
      city: response.data.location.name,
      region: response.data.location.region,
      country: response.data.location.country,
      temp_c: response.data.current.temp_c,
      temp_f: response.data.current.temp_f,
      condition: response.data.current.condition.text,
      icon: response.data.current.condition.icon,
      wind_mph: response.data.current.wind_mph,
      wind_kph: response.data.current.wind_kph,
      wind_degree: response.data.current.wind_degree,
      wind_dir: response.data.current.wind_dir,
    };

    return {
      status: 200,
      message: "Weather data fetch successfully",
      data: weatherData,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
}

async function getCityTimeZone(model: any) {
  try {
    const { city } = model; // Get city from query parameter
    //const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`;
    const apiUrl = `https://api.weatherapi.com/v1/timezone.json?q=${city}&key=${WEATHER_API_KEY}`;
    const response = await axios.get(apiUrl);
    //const weatherData = response.data;
    const weatherData = {
      city: response.data.location.name,
      region: response.data.location.region,
      country: response.data.location.country,
      temp_c: response.data.current.temp_c,
      temp_f: response.data.current.temp_f,
      condition: response.data.current.condition.text,
      icon: response.data.current.condition.icon,
      wind_mph: response.data.current.wind_mph,
      wind_kph: response.data.current.wind_kph,
      wind_degree: response.data.current.wind_degree,
      wind_dir: response.data.current.wind_dir,
    };

    return {
      status: 200,
      message: "Weather data fetch successfully",
      data: weatherData,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
}

async function astronomyUpdate(model: any) {
  try {
    const { city, date } = model; // Get city from query parameter
    const apiUrl = `https://api.weatherapi.com/v1/astronomy.json?q=${city}&dt=${date}&key=${WEATHER_API_KEY}`;

    const response = await axios.get(apiUrl);
    const weatherData = {
      region: response.data.location.region,
      country: response.data.location.country,
      localtime: response.data.location.localtime,
      astronomy: response.data.astronomy.astro,
    };
    return {
      status: 200,
      message: "Weather data fetch successfully",
      data: weatherData,
      //data: response.data,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
}

// module.exports = { getWeather };

export { getWeather, astronomyUpdate, getCityTimeZone };

// function getStubWeatherData(location) {
//     var currentSeconds = new Date().getSeconds();
//     return {
//       weather: {
//         location: location || 'londonon',
//         temperature: `${currentSeconds / 2}\u2103`,
//         weatherDescription: currentSeconds % 2 == 0 ? 'partly cloudy' : 'sunny'
//       }
//     };
//   }
