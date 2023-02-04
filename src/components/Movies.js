import React from 'react';
import Movie from './Movie';
import {Container} from 'react-bootstrap';

class Movies extends React.Component{
  render(){
    return(
      <Container className='movie-data py-4 rounded'>
        <h3 className='text-center mb-4'>Movie Data</h3>
        <div className='movies'>
          {this.props.movieData.map((movie, index) => (
            <Movie key={index}
              movieImageUrl={movie.image_url}
              title={movie.title}
              description={movie.overview}
            />
          ))}
        </div>
      </Container>
    );
  }
}

export default Movies;
