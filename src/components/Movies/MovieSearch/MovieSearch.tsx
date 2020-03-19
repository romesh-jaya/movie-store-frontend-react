/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from '../../../axios';

import Movie from '../Movie/Movie';
import * as styles from './MovieSearch.css';
import * as globStyles from '../../../index.css';
import IMovie from '../../../interfaces/IMovie';
import MovieDetails from '../MovieDetails/MovieDetails';

const searchURL = process.env.REACT_APP_SEARCH_URL|| '';
const errorText = 'Error while accessing OMDB database';
 
const MovieSearch: React.FC = () => {
  const [movies, SetMovies] = useState<IMovie[]>([]);
  const [movError, SetMovError] = useState('');
  const [movInfo, SetMovInfo] = useState('');
  const [selectedMovie, SetSelectedMovie] = useState<IMovie>();
  const [movieQuery, setMovieQuery] = useState('');

  const loadMovies = useCallback(() : void => {
    const filteredMovies: any[] = []; 
    const enhancedMovies: IMovie[] = [];


    axios.get(`${searchURL  }&s=${  movieQuery}`)
      .then((response : any) => {
        console.log(response);
        if (!response.data || response.data.Response === 'False')
        {
          SetSelectedMovie(undefined);
          SetMovies([]);
          SetMovInfo('No response data received.');
          return;
        }

        const fetchedMovies = response.data;

        // get unique values as there are duplicates in the results returned from OMDB at times
        fetchedMovies.Search.forEach((movie : any)  => {
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
          const res = await axios.get(`${searchURL  }&i=${  movieOne.imdbID}`);
          const movie = res.data;
          enhancedMovies.push({
            title: movie.Title, year: movie.Year, imdbID: movie.imdbID, mediaURL: movie.Poster, actors: movie.Actors,
            plot: movie.Plot, type: movie.Type
          });
        };
        
        const getData = async () => {
          return Promise.all(filteredMovies.map(movie => getMovieDetails(movie)));
        };

        getData().then(() => {
          SetMovies(enhancedMovies);
          SetSelectedMovie(undefined);
          SetMovError('');
          SetMovInfo('');
        });
      })
      .catch((err : any) => {
        console.log(err);
        SetMovies([]);
        SetSelectedMovie(undefined);
        SetMovInfo('');
        if (err && err.response && err.response.data && err.response.data.Error) {
          SetMovError(`${errorText}: ${  err.response.data.Error}`);
        }
        else
        {
          SetMovError(errorText);
        }
      });
  }, [movieQuery]);

  // load the settings
  useEffect(() => {
    // initMovies();
  }, []);

  useEffect(() => {
    const listener = (event : any) : void => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (movieQuery)
        {
          loadMovies();
        }
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [loadMovies, movieQuery]);

  const movieSelectedHandler = (movieSel: IMovie) : void => {
    SetSelectedMovie(movieSel);
  };

  const queryOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) : void => {
    setMovieQuery(event.target.value);
  };

  const onSearchClicked = () : void => {
    loadMovies();
  };

  const moviesRender = movies.map(movie => {
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

  const error = movError ? (
    <p className={globStyles['red-color']}>
        Movies can&#39;t be loaded!
      {' '}
      {movError}
    </p>
  ) : null;

  return (
    <div>
      <div className={globStyles['margin-b-20']}>
        <span className={globStyles['margin-r-30']}>
          <TextField
            label="Search Movies"
            value={movieQuery}
            onChange={queryOnChange}
            id='query'
          />
        </span>
        <Button variant="outlined" color="primary" onClick={onSearchClicked} disabled={!movieQuery}>
                Search
        </Button>
      </div>
      <section className={styles.Movies}>
        {moviesRender}
      </section>
      <section>
        {selectedMovie && !movError ? <MovieDetails selectedMovie={selectedMovie} /> : null}
        {(!selectedMovie && !movError && movies.length) ? <p>Click on movie to see details</p> : null}
      </section>
      {error}
      {movInfo? <p>{movInfo}</p> : null}
    </div>
  );
};
 
export default MovieSearch;