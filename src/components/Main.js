import axios from 'axios';
import React from 'react';
import { Button, Container, Form, Col, Row } from 'react-bootstrap';
import Map from './Map';
import Weather from './Weather';
import Movies from './Movies';
import ErrorModal from './ErrorModal';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city: '',
      cityData: {},
      cityMapImg: '',
      displayInfo: false,
      displayError: false,
      errorCode: '',
      errorMessage: '',
      errorSource: '',
      locationData: [],
      movieData: [],
      weatherData: []
    };

    this.getLocation = this.getLocation.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.getMovies = this.getMovies.bind(this);
    this.getData = this.getData.bind(this);
  }

  handleSearchInput = e => {
    let cityName = e.target.value;
    this.setState({
      city: cityName
    });
  };

  displaySearch = async(e) => {
    e.preventDefault();
    const locationData = await this.getLocation();

    const lat = locationData.data[0].lat;
    const lon = locationData.data[0].lon;
    const center = `${lat},${lon}`;
    const cityMapUrl = this.getMap(center);

    const CITY_EXPLORER_API_BASE_URL = process.env.REACT_APP_SERVER;
    const weatherData = await this.getWeather(CITY_EXPLORER_API_BASE_URL, lat, lon);
    const movieData = await this.getMovies(CITY_EXPLORER_API_BASE_URL);

    this.setState({
      displayInfo: true,
      cityData: locationData.data[0],
      cityMapImg: cityMapUrl,
      weatherData: weatherData.data,
      movieData: movieData.data
    });
  };

  async getLocation() {
    const LOCATION_BASE_URL = 'https://us1.locationiq.com/v1/search.php';
    const locationUrl = new URL(LOCATION_BASE_URL);
    locationUrl.searchParams.set('key', process.env.REACT_APP_LOCATIONIQ_KEY);
    locationUrl.searchParams.set('q', this.state.city);
    locationUrl.searchParams.set('format', 'json');

    const data = await this.getData(locationUrl, 'LocationIQ');

    return data;
  }

  async getData(url, dataType){
    const response = await axios.get(url)
      .catch((error) => {
        if (error.response) {
        // Request made and server responded
          this.setState({
            errorCode: error.response.status,
            errorMessage: error.response.data.error,
            errorSource: dataType,
            displayError: true
          });
        } else if (error.request) {
        // The request was made but no response was received
          this.setState({
            errorCode: error.request.status,
            errorMessage: error.message,
            errorSource: dataType,
            displayError: true
          });
        } else {
        // Something happened in setting up the request that triggered an Error
          this.setState({
            errorCode: error.request.status,
            errorMessage: error.message,
            errorSource: dataType,
            displayError: true
          });
        }
      });
    return response;
  }

  getMap = (coordinates) => {
    const MAP_BASE_URL = 'https://maps.locationiq.com/v3/staticmap';

    // It's just easier to not use the URL API and just use a template literal here, because of comma encoding in the 'center' search param

    let mapImageUrl = `${MAP_BASE_URL}?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&center=${coordinates}&zoom=10`;

    return mapImageUrl;
  };

  async getWeather(baseUrl, latitute, longitude){
    const weatherDataUrl = new URL('/weather',baseUrl);
    weatherDataUrl.searchParams.set('lat', latitute);
    weatherDataUrl.searchParams.set('lon', longitude);

    const data = await this.getData(weatherDataUrl, 'Weather');

    return data;
  }

  async getMovies(baseUrl){
    const movieDataUrl = new URL('/movie',baseUrl);
    movieDataUrl.searchParams.set('city', this.state.city);

    const data = await this.getData(movieDataUrl, 'Movie');

    return data;
  }

  handleCloseErrorModal = () => {
    this.setState({
      displayError: false
    });
  };

  render(){
    return(
      <main>
        <Container className='location-explorer py-4 rounded'>
          <h3 className='text-center mb-4'>Location Explorer</h3>
          <Form onSubmit={this.displaySearch}>
            <Row className="align-items-center">
              <Col xs='auto'>
                <Form.Group>
                  <Form.Label visuallyHidden>Enter a City</Form.Label>
                  <Form.Control type='text' placeholder='Enter a City' onInput={this.handleSearchInput}/>
                </Form.Group>
              </Col>
              <Col xs='auto'>
                <Button className="location-explorer-btn" onClick={this.displaySearch}>Explore!</Button>
              </Col>
            </Row>
          </Form>
          {this.state.displayInfo &&
        <div className='lat-and-lon text-center'>
          <h2 className='my-3'>{this.state.cityData.display_name}</h2>
          <h3 className='my-4'>Lat:{this.state.cityData.lat}  Lon:{this.state.cityData.lon}</h3>
          <Map mapImg={this.state.cityMapImg} city={this.state.city} />
        </div>
          }
        </Container>

        {this.state.displayInfo &&
          <Weather weatherData={this.state.weatherData} />
        }

        {this.state.displayInfo &&
        <Movies movieData={this.state.movieData} />
        }

        <ErrorModal
          show={this.state.displayError}
          handleCloseErrorModal={this.handleCloseErrorModal}
          errorSource={this.state.errorSource}
          errorCode={this.state.errorCode}
          errorDescription={this.state.errorMessage}
        />
      </main>
    );
  }
}

export default Main;
