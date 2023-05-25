import React from 'react';
import WeatherComponent from './Gettemp';
import './Local.css'


class GeolocationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
    };
  }

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.showPosition,
        this.showError
      );
    } else {
      this.setState({ error: "Geolocation is not supported by this browser." });
    }
  };

  showPosition = (position) => {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      error: null,
    });
  };

  showError = (error) => {
    let errorMessage;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        errorMessage = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        errorMessage = "An unknown error occurred.";
        break;
      default:
        errorMessage = "Error occurred while fetching location.";
    }
    this.setState({ error: errorMessage });
  };

  render() {
    const { latitude, longitude, error } = this.state;

    return (
      <div className="geolocation-container">
      <h2>Simple Weather App</h2>
      <p>please give location permision to get weather </p>
      <button className="pulse-button" onClick={this.getLocation}>
        Get Weather
      </button>
      {latitude !== null && longitude !== null && (
        <div className="weather-container">
          <WeatherComponent lat={latitude} long={longitude} />
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
    );
  }
}

export default GeolocationComponent;
