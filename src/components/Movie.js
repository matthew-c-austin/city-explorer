import React from 'react';
import Card from 'react-bootstrap/Card';

class Movie extends React.Component{
  render(){
    return(
      <Card className='movie'>
        <Card.Body>
          {this.props.movieImageUrl && <Card.Img variant="bottom" src={this.props.movieImageUrl} />}
          <Card.Title>{this.props.title}</Card.Title>
          <Card.Text>{this.props.description}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default Movie;
