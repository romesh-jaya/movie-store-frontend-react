/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from '../../../axios';

import * as styles from './MovieDetails.css';
import * as globStyles from '../../../index.css';
import IMovieSearch from '../../../interfaces/IMovieSearch';
import { MovieType } from '../../../enums/MovieType';
import MovieDetailsSkeleton from './MovieDetailsSkeleton';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';
import { TextConstants } from '../../../constants/TextConstants';

interface IProps {
  selectedMovie: IMovieSearch
}

const ZERO = 0;
const ONE = 1;

const MovieDetails: React.FC<IProps> = (props: IProps) => {
  const [movieTotal, setMovieTotal] = useState(ZERO);
  const [movieTotalChanged, setMovieTotalChanged] = useState(false);
  const [movieLoading, setMovieLoading] = useState(true);
  const [movError, SetMovError] = useState('');
  const [movID, setMovID] = useState('');
  const { selectedMovie } = props;


  const onAddClicked = (): void => {
    setMovieTotal(prevTotal => prevTotal + ONE);
    setMovieTotalChanged(true);
  };

  const onRemoveClicked = (): void => {
    setMovieTotal(prevTotal => prevTotal - ONE);
    setMovieTotalChanged(true);
  };

  const onSaveClicked = async (): Promise<void> => {
    const movieDetails : IMovieLibrary = 
    {
      imdbID: selectedMovie.imdbID,
      count: movieTotal,
      title: selectedMovie.title,
      year: selectedMovie.year,
      type: selectedMovie.type,
      pGRating: selectedMovie.pGRating,
      languages: [selectedMovie.language],
      genre: selectedMovie.genre
    };
    
    try {
      setMovieLoading(true);
      if (!movID) {
        const response = await axios.post(`${process.env.REACT_APP_NODE_SERVER}/movies`,
          movieDetails);
        setMovID(response.data.id);
      } else {
        await axios.patch(`${process.env.REACT_APP_NODE_SERVER}/movies`,
          {
            id: movID,
            count: movieTotal
          });
      }
      SetMovError('');
      setMovieTotalChanged(false);
      setMovieLoading(false);
    } catch (error) {
      SetMovError(`${TextConstants.MOVIESAVEERRORLIB}: ${error}`);
      setMovieLoading(false);
    }
  };

  // load the total existing in library
  useEffect(() => {
    // this var is to avoid the warning 'can't perform a react state update on an unmounted component.'
    let isMounted = true;

    async function fetchData() : Promise<void> {
      setMovieLoading(true);

      try {
        const response = await axios.get(`${process.env.REACT_APP_NODE_SERVER}/movies/${selectedMovie.imdbID}`);
        if (response && isMounted) {
          setMovieTotal(response.data.count);
          setMovID(response.data.id);
          SetMovError('');
          setMovieLoading(false);
        }
      } catch (error) {
        SetMovError(`${TextConstants.MOVIELOADERRORLIB}: ${error}`);
        setMovieLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedMovie]);

  const isValidUrl = (toValidate: string | undefined): boolean => {
    try {
      // eslint-disable-next-line no-unused-vars
      const url = new URL(toValidate || '');
      return true;
    } catch (_) {
      return false;
    }
  };

  const heading = (selectedMovie.type === MovieType.TvSeries) ? '(TV series)' : '(Movie)';

  const image = isValidUrl(selectedMovie.mediaURL) ? <img src={selectedMovie.mediaURL} alt={selectedMovie.title} /> : null;

  const content = (
    <div className={styles.MovieDetails}>
      <div className={globStyles['margin-b-20']}>
        <div className={globStyles['margin-b-20']}>
          <h1 className={styles['header-custom']}>
            <span className={styles['header-custom-span']}>
              {selectedMovie.title}
              {' '}
              {heading}
              {' '}
            </span>
          </h1>
          <p>{selectedMovie.year}</p>
          <p>{selectedMovie.actors}</p>
          <small>{selectedMovie.plot}</small>
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
        <Button variant="contained" color="secondary" onClick={onSaveClicked} disabled={!movieTotalChanged}>
          Save
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <article>
        <div>
          {movieLoading && <MovieDetailsSkeleton />}
          {!movieLoading && !movError && content}
          {movError ? <p className={globStyles['error-text']}>{movError}</p> : null}
        </div>
      </article>
    </>
  );
};


export default MovieDetails;