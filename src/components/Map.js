import React from 'react';
import { Container } from 'react-bootstrap';

class Map extends React.Component{
  render(){
    return(
      <Container className="map">
        <img src={this.props.mapImg} alt={this.props.city}/>
      </Container>
    );
  }
}

export default Map;
