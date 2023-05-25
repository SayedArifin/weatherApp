import logo from './logo.svg';
import './App.css';
import GeolocationComponent from './components/LocalGeoCollector';
import WeatherComponent from './components/Gettemp';

function App() {
  return (
    <div className="App">
      <GeolocationComponent/>
      
    </div>
  );
}

export default App;
