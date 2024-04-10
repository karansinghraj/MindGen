import axios, { AxiosResponse } from "axios";
import { PassThrough } from "stream";
//import Speaker from 'speaker';
import { Station } from "aws-sdk/clients/iotwireless";
//const axios = require("axios");
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

// // Function to fetch station details and stream URL from the API
// async function fetchStationDetails(stationId: string): Promise<Station | null> {
//   try {
//     const response: AxiosResponse<Station> = await axios.get(`https://api.example.com/stations/${stationId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching station details:', error);
//     return null;
//   }
// }
// // Function to play the live stream using the speaker module
// async function playStream(streamUrl: string) {
//   // Create a pass-through stream to pipe the audio data
//   const audioStream = new PassThrough();

//   try {
//     // Make a GET request to the stream URL and pipe the response to the audio stream
//     const response = await axios.get(streamUrl, { responseType: 'stream' });
//     response.data.pipe(audioStream);

//     // Create a new Speaker instance to play the audio
//     const speaker = new Speaker();

//     // Pipe the audio stream to the speaker
//     audioStream.pipe(speaker);

//     // Handle errors
//     speaker.on('error', (err: Error) => {
//       console.error('Speaker error:', err);
//     });
//   } catch (error) {
//     console.error('Error fetching or playing stream:', error);
//   }
// }

// // Example usage
// // async function main() {
// //   const streamUrl = 'https://example.com/stream'; // Replace with the actual stream URL
// //   await playStream(streamUrl);
// // }

// // Call the main function
// async function radioStation(model:any) {
//   const {stationId} = model; // Replace with the name of the station you want to search
//   try {
//     const station: Station | null = await fetchStationDetails(stationId)as Station;
//     if (station) {
//       console.log('Station:', station);
//       const streamUrl: string = station.streamUrl;
//       playStream(streamUrl);
//     } else {
//       console.error('Failed to fetch station details.');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }
