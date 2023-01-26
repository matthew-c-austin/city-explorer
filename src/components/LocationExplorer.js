import axios from 'axios';
import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import Map from './Map';
import ErrorModal from './ErrorModal';

class LocationExplorer extends React.Component {
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

    const locationUrl = new URL(LOCATION_BASE_URL);
    locationUrl.searchParams.set('key', process.env.REACT_APP_LOCATIONIQ_KEY);
    locationUrl.searchParams.set('q', this.state.city);
    locationUrl.searchParams.set('format', 'json');

    const response = await axios.get(locationUrl)
      .catch((error) => {
        console.log(error);
        if (error.response) {
        // Request made and server responded
          this.setState({
            locationErrorCode: error.response.status,
            locationErrorMessage: error.response.data.error,
            displayLocationError: true
          });
        } else if (error.request) {
        // The request was made but no response was received
          this.setState({
            locationErrorCode: error.request.status,
            locationErrorMessage: error.message,
            displayLocationError: true
          });
        } else {
        // Something happened in setting up the request that triggered an Error
          this.setState({
            locationErrorCode: error.request.status,
            locationErrorMessage: error.message,
            displayLocationError: true
          });
        }
      });

    const center = `${response.data[0].lat},${response.data[0].lon}`;

    let mapImageUrl = new URL(MAP_BASE_URL);
    mapImageUrl.searchParams.set('key', process.env.REACT_APP_LOCATIONIQ_KEY);
    mapImageUrl.searchParams.set('center', center);
    mapImageUrl.searchParams.set('zoom', '10');

    // The stupid URLSearchParams implementation encodes the comma in the center param as %2C, so we have to do a replace within the overall URL.
    let cityMapURL = `${mapImageUrl.origin}${mapImageUrl.pathname}?${mapImageUrl.searchParams}`.replace(/%2C/g,',');

    this.setState({
      displayInfo: true,
      cityData: response.data[0],
      cityMapImg: cityMapURL
    });

  };

  handleCloseErrorModal = () => {
    this.setState({
      displayLocationError: false
    });
  };

  render(){
    return(
      <>
        <Container>
          <Form onSubmit={this.displaySearch}>
            <Form.Group>
              <Form.Label>Enter City</Form.Label>
              <Form.Control type='text' onInput={this.handleSearchInput}/>
            </Form.Group>
            <Button onClick={this.displaySearch}>Explore!</Button>
          </Form>
        </Container>

        {this.state.displayInfo &&
        <>
          <h2>{this.state.cityData.display_name}</h2>
          <p>Lat:{this.state.cityData.lat}  Lon:{this.state.cityData.lon}</p>
          <Map mapImg={this.state.cityMapImg} city={this.state.city} />
        </>
        }

        {this.state.displayLocationError &&
        <>
          <ErrorModal
            show={this.state.displayLocationError}
            handleCloseErrorModal={this.state.handleCloseErrorModal}
            errorCode={this.state.locationErrorCode}
            errorDescription={this.state.locationErrorMessage}
          />
        </>
        }
      </>
    );
  }
}

export default LocationExplorer;
