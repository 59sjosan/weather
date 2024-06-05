import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Weather.css';
import sunnyDayJpg from './sunny-day.jpg';
import rainyDayJpg from './rainy-day.jpg';
import thunderstormJpg from './thunderstorm.jpg';
import cloudyDayJpg from './cloudy-day.jpg';
import clearNightJpg from './clear-night.jpg';
import cloudyNightJpg from './cloudy-night.jpg';
import rainyNightJpg from './rainy-night.jpg';
import defaultJpg from './default.jpg'; 

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'd6dac1660dmshf04ca5005f30522p11398ajsna7d63da5e723',
          'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const result = await response.json();
        setWeatherData(result);
      } catch (error) {
        setError(error);
      }
    };

    const fetchForecastData = async (latitude, longitude) => {
      const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${latitude},${longitude}&days=5`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'd6dac1660dmshf04ca5005f30522p11398ajsna7d63da5e723',
          'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }
        const result = await response.json();
        setForecastData(result.forecast.forecastday);
      } catch (error) {
        setError(error);
      }
    };

    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            fetchWeatherData(latitude, longitude);
            fetchForecastData(latitude, longitude);
          },
          (error) => {
            setError(error);
          }
        );
      } else {
        setError(new Error('Geolocation is not supported by this browser.'));
      }
    };

    getCurrentLocation();
  }, []);

  if (error) {
    return <div className="weather-container">Error: {error.message}</div>;
  }

  if (!weatherData || !forecastData) {
    return <div className="weather-container">Loading...</div>;
  }

  const { temp_c, humidity, condition, feelslike_c, is_day } = weatherData.current;

  // Function to format the date from local time
  const formatDate = (dateString) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[2]);
    const date = new Date(year, month, day);
    const dayIndex = date.getDay(); // Returns the day of the week (0 for Sunday, 1 for Monday, etc.)
    return daysOfWeek[dayIndex];
  };

  let backgroundStyle = {};

  // Determine background image based on weather condition and day/night
  if (is_day) {
    switch (condition.text.toLowerCase()) {
      case 'sunny':
        backgroundStyle = { backgroundImage: `url(${sunnyDayJpg})` };
        break;
      case 'rain':
      case 'rainy':
        backgroundStyle = { backgroundImage: `url(${rainyDayJpg})` };
        break;
      case 'thunderstorm':
        backgroundStyle = { backgroundImage: `url(${thunderstormJpg})` };
        break;
      case 'cloudy':
      case 'partly cloudy':
        backgroundStyle = { backgroundImage: `url(${cloudyDayJpg})` };
        break;
      // Add cases for other day conditions
      default:
        backgroundStyle = { backgroundImage: `url(${defaultJpg})` };
        break;
    }
  } else {
    switch (condition.text.toLowerCase()) {
      case 'clear':
        backgroundStyle = { backgroundImage: `url(${clearNightJpg})` };
        break;
      case 'rain':
      case 'rainy':
        backgroundStyle = { backgroundImage: `url(${rainyNightJpg})` };
        break;
      case 'cloudy':
      case 'partly cloudy':
        backgroundStyle = { backgroundImage: `url(${cloudyNightJpg})` };
        break;
      // Add cases for other night conditions
      default:
        backgroundStyle = { backgroundImage: `url(${defaultJpg})` };
        break;
    }
  }

  return (
    <div className="weather-app" style={backgroundStyle}>
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-md-3">
            <div className="card location-card mb-3">
              <div className="card-body">
                <h1>{weatherData.location.name}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-3">
            <div className="card weather-card mb-3">
              <div className="card-body">
                <img className="weather-icon" src={`https:${condition.icon}`} alt={condition.text} />
                <h5 className="card-title">Condition</h5>
                <p className="card-text text-left">{condition.text}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card weather-card mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">Temperature</h5>
                <p className="card-text">{temp_c}°C</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card weather-card mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">Feels Like</h5>
                <p className="card-text">{feelslike_c}°C</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card weather-card mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">Humidity</h5>
                <p className="card-text">{humidity}%</p>
              </div>
            </div>
          </div>
        </div>
        <h2 className="my-4">Weather Forecast</h2>
        <div className="row justify-content-center">
          {forecastData.map((day, index) => (
            <div className="col-md-4" key={index}>
              <div className="card forecast-card mb-3">
                <div className="card-body text-center">
                  <h5 className="card-title">{formatDate(day.date)} <br/>{day.date}</h5>
                  <img className="forecast-icon" src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} />
                  <p className="card-text">{day.day.condition.text}</p>
                  <p className="card-text">Max Temp: {day.day.maxtemp_c}°C</p>
                  <p className="card-text">Min Temp: {day.day.mintemp_c}°C</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
