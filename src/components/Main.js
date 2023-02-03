import axios from 'axios';
import React from 'react';
import { Button, Container, Form, Col, Row } from 'react-bootstrap';
import Map from './Map';
import ErrorModal from './ErrorModal';
import Weather from './Weather';
import Movie from './Movie';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayInfo: false,
      displayLocationError: false,
      city: '',
      cityData: {},
      cityMapImg: '',
      restaurantData: [],
      locationData: [],
      locationErrorCode: '',
      locationErrorMessage: '',
      weatherData: []

    };

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

    const LOCATION_BASE_URL = 'https://us1.locationiq.com/v1/search.php';
    const MAP_BASE_URL = 'https://maps.locationiq.com/v3/staticmap';
    const CITY_EXPLORER_API_BASE_URL = process.env.REACT_APP_SERVER;

    const locationUrl = new URL(LOCATION_BASE_URL);
    locationUrl.searchParams.set('key', process.env.REACT_APP_LOCATIONIQ_KEY);
    locationUrl.searchParams.set('q', this.state.city);
    locationUrl.searchParams.set('format', 'json');

    const locationData = await this.getData(locationUrl, 'LocationIQ');

    const center = `${locationData.data[0].lat},${locationData.data[0].lon}`;

    let mapImageUrl = new URL(MAP_BASE_URL);
    mapImageUrl.searchParams.set('key', process.env.REACT_APP_LOCATIONIQ_KEY);
    mapImageUrl.searchParams.set('center', center);
    mapImageUrl.searchParams.set('zoom', '10');

    // The stupid URLSearchParams implementation encodes the comma in the center param as %2C, so we have to do a replace within the overall URL.
    let cityMapUrl = `${mapImageUrl.origin}${mapImageUrl.pathname}?${mapImageUrl.searchParams}`.replace(/%2C/g,',');

    const weatherDataUrl = new URL('/weather',CITY_EXPLORER_API_BASE_URL);
    weatherDataUrl.searchParams.set('lat', locationData.data[0].lat);
    weatherDataUrl.searchParams.set('lon', locationData.data[0].lon);

    const weatherData = await this.getData(weatherDataUrl, 'Weather');

    const movieDataUrl = new URL('/movie',CITY_EXPLORER_API_BASE_URL);
    movieDataUrl.searchParams.set('city', this.state.city);

    const movieData = await this.getData(movieDataUrl, 'Movie');

    console.log(movieData.data);

    this.setState({
      displayInfo: true,
      cityData: locationData.data[0],
      cityMapImg: cityMapUrl,
      weatherData: weatherData.data,
      movieData: movieData.data
    });
  };

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
        <Container className='weather-data py-4 rounded'>
          <h3 className='text-center mb-4'>Weather Data</h3>
          <div className='forecast'>
            {this.state.weatherData.map((day) => (
              <Weather key={day.date}
                date={day.date}
                description={day.description}
              />
            ))}
          </div>
        </Container>
        }

        {this.state.displayInfo &&
        <Container className='movie-data py-4 rounded'>
          <h3 className='text-center mb-4'>Movie Data</h3>
          <div className='movies'>
            {this.state.movieData.map((movie, index) => (
              <Movie key={index}
                movieImageUrl={movie.image_url}
                title={movie.title}
                description={movie.overview}
              />
            ))}
          </div>
        </Container>
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
