import React from 'react';
import Card from 'react-bootstrap/Card';

class Weather extends React.Component{
  render(){
    return(
      <Card>
        <Card.Body>
          <Card.Title>{this.props.date}</Card.Title>
          <Card.Text className="text-center">{this.props.description}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default Weather;
