/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect, useContext, ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Drawer } from '@material-ui/core';
import axios from '../../../axios';

import * as styles from './MovieDetails.css';
import * as globStyles from '../../../index.css';
import { MovieType } from '../../../enums/MovieType';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';
import { TextConstants } from '../../../constants/TextConstants';
import { getMovieDetails } from '../../../utils/MovieUtil';
import KeyContext from '../../../context/KeyContext';
import IMovieSearch from '../../../interfaces/IMovieSearch';
import Spinner from '../../UI/Spinner/Spinner';

interface IProps {
  selectedMovieIMDBId: string;
  openDrawerValue: boolean;
  openDrawer: () => void;
}

const searchURL = process.env.REACT_APP_SEARCH_URL || '';

const MovieDetails: React.FC<IProps> = (props: IProps) => {
  const [movieTotal, setMovieTotal] = useState(0);
  const [movieTotalInitial, setMovieTotalInitial] = useState(0);
  const [movieTotalChanged, setMovieTotalChanged] = useState(false);
  const [movieLoading, setMovieLoading] = useState(false);
  const [movError, SetMovError] = useState('');
  const [movID, setMovID] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<IMovieSearch | undefined>();
  const apiKey = useContext(KeyContext);
  const { selectedMovieIMDBId, openDrawer, openDrawerValue } = props;

  const handleDrawerToggle = (): void => {
    openDrawer();
  };

  const handleDrawerToggleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift' || (event as React.KeyboardEvent).key === 'Control')
    ) {
      return;
    }

    openDrawer();
  };

  const onReset = (): void => {
    setMovieTotalChanged(false);
    setMovieTotal(movieTotalInitial);
  };

  const onAddClicked = (): void => {
    setMovieTotal(prevTotal => prevTotal + 1);
    setMovieTotalChanged(true);
  };

  const onRemoveClicked = (): void => {
    setMovieTotal(prevTotal => prevTotal - 1);
    setMovieTotalChanged(true);
  };

  const onSaveClicked = async (): Promise<void> => {
    if (selectedMovie) {
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
        setMovieTotalInitial(movieTotal);
        setMovieTotalChanged(false);
        setMovieLoading(false);
      } catch (error) {
        SetMovError(`${TextConstants.MOVIESAVEERRORLIB}: ${error}`);
        setMovieLoading(false);
      }
    }
  };

  // load the total existing in library
  useEffect(() => {
    // this var is to avoid the warning 'can't perform a react state update on an unmounted comp1nt.'
    let isMounted = true;

    async function fetchData() : Promise<void> {
      setMovieLoading(true);

      try {
        const movie = await getMovieDetails(selectedMovieIMDBId, searchURL, apiKey);
        setSelectedMovie(movie);
        const response = await axios.get(`${process.env.REACT_APP_NODE_SERVER}/movies/imdbid/${selectedMovieIMDBId}`);
        if (response && isMounted) {
          setMovieTotalInitial(response.data.count);
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

    if (selectedMovieIMDBId) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [apiKey, selectedMovieIMDBId]);

  const isValidUrl = (toValidate: string | undefined): boolean => {
    try {
      // eslint-disable-next-line no-unused-vars
      const url = new URL(toValidate || '');
      return true;
    } catch (_) {
      return false;
    }
  };

  const renderContent = () : ReactNode | null => {
    if (!selectedMovie) {
      return null;
    }

    const heading = (selectedMovie.type === MovieType.TvSeries) ? '(TV series)' : '(Movie)';
    const image = isValidUrl(selectedMovie.mediaURL) ? <img src={selectedMovie.mediaURL} alt={selectedMovie.title} /> : null;  

    let borderBoxStyle = movieTotal? styles['movie-present'] : styles['movie-absent'];
    borderBoxStyle += ` ${styles['movie-details']}`;

    return (
      <div className={borderBoxStyle}>
        <div className={globStyles['margin-b-20']}>
          <div className={globStyles['margin-b-20']}>
            <h3 className={styles['header-custom']}>
              <span className={styles['header-custom-span']}>
                {selectedMovie.title}
                {' '}
                {heading}
                {' '}
              </span>
            </h3>
            <p>{selectedMovie.year}</p>
            <p>{selectedMovie.actors}</p>
            <small>{selectedMovie.plot}</small>
          </div>
          {image}
        </div>
        {
            movieLoading? (
              <div className={styles['spinner-div']}>
                <Spinner />
              </div>
            ) : null
          }
        <div className={globStyles['margin-b-20']}>
          <span className={globStyles['margin-r-10']}>
            <Button variant="contained" color="primary" onClick={onAddClicked}>
              +1 to library
            </Button>
          </span>
          <Button variant="contained" color="secondary" onClick={onRemoveClicked} disabled={movieTotal < 2}>
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
                style: { textAlign: 'right', width: '90px' }
              }
            }
              value={movieTotal}
              type="number"
            />
          </span>
          <span className={styles['first-button']}>
            <Button onClick={onReset} color="primary" variant="contained">
              Reset
            </Button>
          </span>
          <Button variant="contained" color="secondary" onClick={onSaveClicked} disabled={!movieTotalChanged}>
            Save
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={openDrawerValue}
      onClose={handleDrawerToggle}
      onKeyDown={handleDrawerToggleKeyDown}
      classes={
        {
          paper: styles.drawer,
        }
      }
    >
      <div>
        {!movError && renderContent()}
        {movError ? <p className={globStyles['error-text']}>{movError}</p> : null}
      </div>
    </Drawer>
  );
};


export default MovieDetails;