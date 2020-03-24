/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import axios from '../../../axios';

import * as styles from './MovieDetails.css';
import * as globStyles from '../../../index.css';
import IMovie from '../../../interfaces/IMovie';
import { MovieType } from '../../../enums/MovieType';
import MovieDetailsSkeleton from './MovieDetailsSkeleton';
 
const errorText = 'Error while accessing Node Server';

interface IProps {
  selectedMovie: IMovie | undefined
}

const ZERO = 0;
const ONE = 1;

const MovieDetails: React.FC<IProps> = (props) => {
  const [movieTotal, setMovieTotal] = useState(ZERO);
  const [movieTotalChanged, setMovieTotalChanged] = useState(false);
  const [movieLoading, setMovieLoading] = useState(true);
  const [movError, SetMovError] = useState('');
  const { selectedMovie} = props;
  
  
  const onAddClicked = () : void => {
    setMovieTotal(prevTotal => prevTotal + ONE);
    setMovieTotalChanged(true);
  };

  const onRemoveClicked = () : void => {
    setMovieTotal(prevTotal => prevTotal - ONE);
    setMovieTotalChanged(true);
  };

  const onSaveClicked = () : void => {
    axios.patch(`${process.env.REACT_APP_NODE_SERVER  }/movies`,
      {
        imdbID: selectedMovie && selectedMovie.imdbID,
        count: movieTotal
      });
    setMovieTotalChanged(false);
  };

  // load the total existing in library
  useEffect(() => {
    // this var is to avoid the warning 'can't perform a react state update on an unmounted component.'
    let isMounted = true;
      
    setMovieLoading(true);
    axios.get(`${process.env.REACT_APP_NODE_SERVER  }/movies/${selectedMovie &&  selectedMovie.imdbID}`)
      .then(response => {
        if (response && isMounted) {
          setMovieTotal(response.data.count);
          SetMovError('');
          setMovieLoading(false);
        }
      })
      .catch((err : any) => {
        console.log(err);
        SetMovError(errorText);
        setMovieLoading(false);
      });
    

    return () => {
      isMounted = false;
    };

  }, [selectedMovie]);



  const isValidUrl = (toValidate: string | undefined) :boolean => {
    try {
      // eslint-disable-next-line no-unused-vars
      const url = new URL(toValidate || '');
      return true;
    } catch (_) {
      return false;  
    }
  };

  const heading = (selectedMovie && (selectedMovie.type === MovieType.TvSeries)) ? '(TV series)' : '(Movie)';

  const image = isValidUrl(selectedMovie && selectedMovie.mediaURL) ? <img src={selectedMovie && selectedMovie.mediaURL} alt={selectedMovie && selectedMovie.title} /> : null;

  const content = (
    <div className={styles.MovieDetails}>
      <div className={globStyles['margin-b-20']}>
        <div className={globStyles['margin-b-20']}>
          <h1 className={styles['header-custom']}>
            <span className={styles['header-custom-span']}>
              {selectedMovie && selectedMovie.title}  
              {' '}
              {heading}
              {' '}
            </span>
          </h1>
          <p>{selectedMovie && selectedMovie.year}</p>
          <p>{selectedMovie &&selectedMovie.actors}</p>
          <small>{selectedMovie && selectedMovie.plot}</small>
        </div>
        {image}
      </div>
      <div className={globStyles['margin-b-20']}>
        <span className={globStyles['margin-r-10']}>
          <Button variant="contained" color="primary" onClick={onAddClicked}>
      +1 to library
          </Button>
        </span>
        <Button variant="contained" color="secondary" onClick={onRemoveClicked} disabled={movieTotal < ONE}>
        -1 from library
        </Button>
      </div>
      <div className={globStyles['margin-b-20']}>
        <span className={globStyles['margin-r-30']}>
          <TextField
            id="outlined-basic"
            label="Total Count"
            InputProps={
            {
              readOnly: true
            }
            }
            inputProps={
            {
              style: { textAlign: 'right' }
            }
            }
            value={movieTotal}
            type="number"
          />
        </span>
        <Button variant="outlined" color="secondary" onClick={onSaveClicked} disabled={!movieTotalChanged}>
        Save
        </Button>
      </div>
    </div>
  );
    
  return (
    <>
      <article>
        <div>
          {movieLoading && <MovieDetailsSkeleton /> }
          {!movieLoading && !movError && content}
          {movError? <p className={globStyles['error-text']}>{movError}</p> : null}
        </div>
      </article>
    </>
  );
};

MovieDetails.propTypes = {
  selectedMovie: PropTypes.shape({
    title: PropTypes.string.isRequired, 
    year: PropTypes.string.isRequired, 
    imdbID: PropTypes.string.isRequired, 
    actors: PropTypes.string.isRequired,
    mediaURL: PropTypes.string, 
    plot: PropTypes.string, 
    type: PropTypes.string,
  }).isRequired
};
 
export default MovieDetails;