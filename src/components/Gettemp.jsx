import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gettemp.css';

const WeatherComponent = (props) => {
  const [temperature, setTemperature] = useState(null);
  const [feels, setFeels] = useState(null);
  const [weather, setWeather] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState(null);
  const [currentDay, setCurrentDay] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const latitude = searchQuery ? null : props.lat;
  const longitude = searchQuery ? null : props.long;
  const apiKey = process.env.REACT_APP_API_KEY;
 

  const fetchTemperature = async () => {
    try {
      let url;
      if (searchQuery) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}&units=metric`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      }
      const response = await axios.get(url);
      const data = response.data;

      if (response.status === 200) {
        if (searchQuery) {
          setTemperature(data.main.temp);
          setFeels(data.main.feels_like);
          setHumidity(data.main.humidity);
          setWindSpeed(data.wind.speed);
          setCountryCode(data.sys.country);
          setCity(data.name);
          setWeather(data.weather[0].main);
        } else {
          setTemperature(data.list[0].main.temp);
          setFeels(data.list[0].main.feels_like);
          setHumidity(data.list[0].main.humidity);
          setWindSpeed(data.list[0].wind.speed);
          setCountryCode(data.city.country);
          setCity(data.city.name);
          setWeather(data.list[0].weather[0].main);
        }
      } else {
        console.log('Error:', data.message);
        // Handle the error here
      }
    } catch (error) {
      console.log('Error:', error.message);
      // Handle the error here
    }
  };

  useEffect(() => {
    fetchTemperature();
  }, [searchQuery, latitude, longitude, apiKey]);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const url = `https://restcountries.com/v3.1/alpha/${countryCode}`;
        const response = await axios.get(url);
        const data = response.data[0];

        if (response.status === 200) {
          const officialName = data.name.official;
          setCountryName(officialName);
        } else {
          console.log('Error:', data.message);
          // Handle the error here
        }
      } catch (error) {
        console.log('Error:', error.message);
        // Handle the error here
      }
    };

    if (countryCode) {
      fetchCountry();
    }
  }, [countryCode]);

  useEffect(() => {
    const currentDateObj = new Date();
    
    setCurrentDay(currentDateObj.toLocaleDateString('en-US', { weekday: 'long' }));
    setCurrentDate(currentDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  }, []);

  let weatherImage;

if (weather === 'Haze' || weather === 'Snow' || weather === 'Mist' || weather === 'Fog') {
  weatherImage = <img src="/photo/foggy.gif" alt="Rain" className='weather-icon' />;
} else if (weather === 'Rain' || weather === 'Drizzle') {
  weatherImage = <img src="/photo/rain.gif" alt="No" className='weather-icon'/>;
} else if (weather === 'Windy') {
  weatherImage = <img src="/photo/wind-power.gif" alt="No" className='weather-icon' />;
} else if (weather === 'Clear Sky' || weather === 'Clear') {
  weatherImage = <img src="/photo/sun.gif" alt="No" className='weather-icon'/>;
} else if (weather === 'Cloudy'||weather === 'Clouds') {
  weatherImage = <img src="/photo/clouds.gif" alt="No" className='weather-icon'/>;
} else {
  weatherImage = <img src="/photo/sand-castle.gif" alt="No" className='weather-icon' />;
}

  return (
    <div className='weather-app'>
      <div className="weather-card">
        {temperature !== null ? (
          <>
            <div className="weather-info">
              <div className="date-location">
                <h2 className="date-dayname">{currentDay}</h2>
                <span className="date-day">{currentDate}</span>
                <br/>
                <span className="location">{city}, {countryName}</span>
              </div>
              <div className="weather-container">
                {weatherImage}
                <h1 className="weather-temp">{temperature}°C</h1>
                <h3 className="weather-desc">{weather}</h3>
              </div>
            </div>
            <div className="weather-details">
              <div className="weather-detail">
                <span className="title">FEELS:</span>
                <span className="value">{feels}°C</span>
              </div>
              <div className="weather-detail">
                <span className="title">HUMIDITY:</span>
                <span className="value">{humidity}%</span>
              </div>
              <div className="weather-detail">
                <span className="title">WIND:</span>
                <span className="value">{windSpeed} km/h</span>
              </div>
            </div>
          </>
        ) : (
          <p>Loading temperature...</p>
        )}
        <div className="location-input">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a location..."
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
