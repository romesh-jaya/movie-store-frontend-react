import React, { useState, useEffect, useCallback, useContext } from 'react';

import axios from '../../axios';
import KeyContext from '../../context/KeyContext';
import IMovie from '../../interfaces/IMovie';
import Movie from '../Movies/Movie/Movie';

import * as globStyles from '../../index.css';
import MovieDetails from '../Movies/MovieDetails/MovieDetails';
import MovieLoadingSkeleton from '../Movies/MovieLoadingSkeleton';

const ZERO = 0;
const ONE = 1;
const searchURL = process.env.REACT_APP_SEARCH_URL || '';
const errorText = 'Error while retrieving movie data.';

interface IState {
  movies: IMovie[];
  movError: string;
  movInfo: string;
  selectedMovie: IMovie | undefined;
  isLoading: boolean;
  currentPage: number
}

const MyLibrary: React.FC = () => {
  const [state, setState] = useState<IState>({
    movies: [],
    movError: '',
    movInfo: '',
    selectedMovie: undefined,
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


  const loadMovies = useCallback((): void => {
    const enhancedMovies: IMovie[] = [];
    mergeState('isLoading', true);

    axios.get(`${process.env.REACT_APP_NODE_SERVER}/movies`)
      .then((response: any) => {
        console.log(response);
        if (!response.data.length) {
          mergeState('selectedMovie', undefined);
          mergeState('movies', []);
          mergeState('movError', '');
          mergeState('movInfo', 'No movies have been added to library.');
          mergeState('isLoading', false);
          return;
        }

        const libMovies = response.data;

        // loop through the filteredMovies to get additional actors info using the OMDB details URL
        const getMovieDetails = async (movieOne: any): Promise<any> => {
          const res = await axios.get(`${searchURL}?apikey=${apiKey}&i=${movieOne.imdbID}`);
          const movie = res.data;
          enhancedMovies.push({
            title: movie.Title, year: movie.Year, imdbID: movie.imdbID, mediaURL: movie.Poster, actors: movie.Actors,
            plot: movie.Plot, type: movie.Type
          });
        };

        const getData = async () => {
          return Promise.all(libMovies.map((movie: any) => getMovieDetails(movie)));
        };

        getData().then(() => {
          mergeState('selectedMovie', undefined);
          mergeState('movies', enhancedMovies);
          mergeState('movError', '');
          mergeState('movInfo', '');
          mergeState('isLoading', false);
          mergeState('currentPage', ONE);
        });
      })
      .catch((err: any) => {
        console.log(err);
        mergeState('selectedMovie', undefined);
        mergeState('movies', []);

        mergeState('movInfo', '');
        mergeState('isLoading', false);

        if (err && err.response && err.response.data && err.response.data.Error) {
          mergeState('movError', `${errorText}: ${err.response.data.Error}`);
        } else {
          mergeState('movError', errorText);
        }
      });


  }, [apiKey, mergeState]);

  const movieSelectedHandler = (movieSel: IMovie): void => {
    mergeState('selectedMovie', movieSel);
  };

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);


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

export default MyLibrary;