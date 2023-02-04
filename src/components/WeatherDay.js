import React from 'react';
import Card from 'react-bootstrap/Card';

class WeatherDay extends React.Component{
  render(){
    return(
      <Card>
        <Card.Body>
          <Card.Title className="text-center">{this.props.date}</Card.Title>
          <Card.Text className="text-center">{this.props.description}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default WeatherDay;
