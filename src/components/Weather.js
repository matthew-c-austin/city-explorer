import React from 'react';
import WeatherDay from './WeatherDay';
import {Container} from 'react-bootstrap';

class Weather extends React.Component{
  render(){
    return(
      <Container className='weather-data py-4 rounded'>
        <h3 className='text-center mb-4'>Weather Data</h3>
        <div className='forecast'>
          {this.props.weatherData.map((day) => (
            <WeatherDay key={day.date}
              date={day.date}
              description={day.description}
            />
          ))}
        </div>
      </Container>
    );
  }
}

export default Weather;
