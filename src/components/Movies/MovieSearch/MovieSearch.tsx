/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';

import axios from '../../../axios';
import Movie from '../Movie/Movie';
import styles from './MovieSearch.css';
import * as globStyles from '../../../index.css';
import IMovie from '../../../interfaces/IMovie';
import MovieDetails from '../MovieDetails/MovieDetails';
import MovieLoadingSkeleton from '../MovieLoadingSkeleton';
import KeyContext from '../../../context/KeyContext';

const searchURL = process.env.REACT_APP_SEARCH_URL || '';
const errorText = 'Error while accessing OMDB database';
const ZERO = 0;
const ONE = 1;

interface IState {
  movies: IMovie[];
  movError: string;
  movInfo: string;
  wasLastSearchSuccess: boolean;
  selectedMovie: IMovie | undefined;
  movieQuery: string;
  isLoading: boolean;
  currentPage: number
}

const MovieSearch: React.FC = () => {
  const [state, setState] = useState<IState>({
    movies: [],
    movError: '',
    movInfo: '',
    wasLastSearchSuccess: false,
    selectedMovie: undefined,
    movieQuery: '',
    isLoading: false,
    currentPage: ONE,
  });
  const apiKey = useContext(KeyContext);

  const mergeState = useCallback((name: string, value: any): void => {
    setState(oldState => ({
      ...oldState,
      [name]: value
    }));
  }, []);

  const loadMovies = useCallback((pageNo?: number): void => {
    const filteredMovies: any[] = [];
    const enhancedMovies: IMovie[] = [];

    const page = pageNo ? '&page=' + pageNo.toFixed(ZERO) : '';
    mergeState('isLoading', true);

    axios.get(`${searchURL}?apikey=${apiKey}&s=${state.movieQuery}${page}`)
      .then((response: any) => {
        console.log(response);
        if (!response.data || response.data.Response === 'False') {
          mergeState('selectedMovie', undefined);
          mergeState('movies', []);
          mergeState('movError', '');
          mergeState('movInfo', 'No response data received.');
          mergeState('isLoading', false);

          if (!pageNo) {
            mergeState('wasLastSearchSuccess', false);
          } else {
            mergeState('currentPage', pageNo);
          }
          return;
        }

        const fetchedMovies = response.data;

        // get unique values as there are duplicates in the results returned from OMDB at times
        fetchedMovies.Search.forEach((movie: any) => {
          let matchFound = false;
          filteredMovies.forEach(filteredMovie => {
            if (filteredMovie.imdbID === movie.imdbID) {
              matchFound = true;
            }
          });
          if (!matchFound) {
            filteredMovies.push(movie);
          }
        });

        // loop through the filteredMovies to get additional actors info using the OMDB details URL
        const getMovieDetails = async (movieOne: any): Promise<any> => {
          const res = await axios.get(`${searchURL}?apikey=${apiKey}&i=${movieOne.imdbID}`);
          const movie = res.data;
          const genres = movie.Genre ? movie.Genre.split(', ') : 'None';
          enhancedMovies.push({
            title: movie.Title, year: movie.Year, imdbID: movie.imdbID, mediaURL: movie.Poster, actors: movie.Actors,
            plot: movie.Plot, type: movie.Type, pGRating: movie.Rated, language: movie.Language, genre: genres
          });
        };

        const getData = async () => {
          return Promise.all(filteredMovies.map(movie => getMovieDetails(movie)));
        };

        getData().then(() => {
          mergeState('selectedMovie', undefined);
          mergeState('movies', enhancedMovies);
          mergeState('movError', '');
          mergeState('movInfo', '');
          mergeState('isLoading', false);

          if (!pageNo) {
            mergeState('currentPage', ONE);
            mergeState('wasLastSearchSuccess', true);
          } else {
            mergeState('currentPage', pageNo);
          }
        });
      })
      .catch((err: any) => {
        console.log(err);
        mergeState('selectedMovie', undefined);
        mergeState('movies', []);

        mergeState('movInfo', '');
        mergeState('isLoading', false);

        if (!pageNo) {
          mergeState('wasLastSearchSuccess', false);
        }
        if (err && err.response && err.response.data && err.response.data.Error) {
          mergeState('movError', `${errorText}: ${err.response.data.Error}`);
        } else {
          mergeState('movError', errorText);
        }
      });
  }, [mergeState, apiKey, state.movieQuery]);


  // Enter key behaviour for Search - for the entire form. Binding to TextField control didn't work as it is a container
  useEffect(() => {
    const listener = (event: any): void => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (state.movieQuery) {
          loadMovies();
        }
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [loadMovies, state.movieQuery]);

  const movieSelectedHandler = (movieSel: IMovie): void => {
    mergeState('selectedMovie', movieSel);
  };

  const queryOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    mergeState('movieQuery', event.target.value.trim());
  };

  const onSearchClicked = (): void => {
    loadMovies();
  };

  const onPageNoChanged = (_: object, page: number): void => {
    loadMovies(page);
  };

  const moviesRender = state.movies.map(movie => {
    return (
      <Movie
        key={movie.imdbID}
        title={movie.title}
        body={movie.actors}
        year={movie.year}
        clicked={() => movieSelectedHandler(movie)}
      />
    );
  });

  const error = state.movError ? (
    <p className={globStyles['error-text']}>
      Movies can&#39;t be loaded!
      {' '}
      {state.movError}
    </p>
  ) : null;

  const content = (
    <div>
      <div className={styles['search-input']}>
        <span className={globStyles['margin-r-30']}>
          <TextField
            label="Search OMDB"
            value={state.movieQuery}
            onChange={queryOnChange}
            id='query'
          />
        </span>
        <Button variant="outlined" color="primary" onClick={onSearchClicked} disabled={!state.movieQuery}>
          Search
        </Button>
      </div>
      {state.wasLastSearchSuccess ? <Pagination count={10} onChange={onPageNoChanged} page={state.currentPage} /> : null}
      <section className={globStyles.movies}>
        {moviesRender}
      </section>
      <section>
        {state.selectedMovie && !state.movError ? <MovieDetails selectedMovie={state.selectedMovie} /> : null}
        {(!state.selectedMovie && !state.movError && state.movies.length) ? <p>Click on movie to see details</p> : null}
      </section>
      {error}
      {state.movInfo ? <p>{state.movInfo}</p> : null}
    </div>
  );

  return (
    <>
      {state.isLoading && <MovieLoadingSkeleton />}
      {!state.isLoading ? content : null}
    </>
  );
};

export default MovieSearch;