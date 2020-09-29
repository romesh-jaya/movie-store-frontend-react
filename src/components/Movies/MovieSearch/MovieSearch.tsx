/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useEffect, useCallback, useContext, ReactNode } from 'react';
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
import { TextConstants } from '../../../constants/TextConstants';

const searchURL = process.env.REACT_APP_SEARCH_URL || '';

const MovieSearch: React.FC = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [movError, setMovError] = useState('');
  const [movInfo, setMovInfo] = useState('');
  const [wasLastSearchSuccess, setWasLastSearchSuccess] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | undefined>();
  const [inputQuery, setInputQuery] = useState('');
  const [inputQueryTrimmed, setInputQueryTrimmed] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const apiKey = useContext(KeyContext);

  const loadMovies = useCallback((pageNo?: number): void => {
    const filteredMovies: any[] = [];
    const enhancedMovies: IMovie[] = [];

    const page = pageNo ? '&page=' + pageNo.toFixed(0) : '';
    setIsLoading(true);

    axios.get(`${searchURL}?apikey=${apiKey}&s=${inputQueryTrimmed}${page}`)
      .then((response: any) => {
        if (!response.data || response.data.Response === 'False') {
          setSelectedMovie(undefined);
          setMovies([]);
          setMovError('');
          setMovInfo(TextConstants.NOMOVIESFOUND);
          setIsLoading(false);

          if (!pageNo) {
            setWasLastSearchSuccess(false);
          } else {
            setCurrentPage(pageNo);
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
          setSelectedMovie(undefined);
          setMovies(enhancedMovies);
          setMovError('');
          setMovInfo('');
          setIsLoading(false);

          if (!pageNo) {
            setCurrentPage(1);
            setWasLastSearchSuccess(true);
          } else {
            setCurrentPage(pageNo);
          }
        });
      })
      .catch((err: any) => {
        setSelectedMovie(undefined);
        setMovies([]);
        setMovInfo('');
        setIsLoading(false);

        if (!pageNo) {
          setWasLastSearchSuccess(false);
        }
        if (err && err.response && err.response.data && err.response.data.Error) {
          setMovError(`${TextConstants.MOVIELOADERROROMDB}: ${err.response.data.Error}`);
        } else {
          setMovError(TextConstants.MOVIELOADERROROMDB);
        }
      });
  }, [apiKey, inputQueryTrimmed]);


  // Enter key behaviour for Search - for the entire form. Binding to TextField control didn't work as it is a container
  useEffect(() => {
    const listener = (event: any): void => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (inputQueryTrimmed) {
          loadMovies();
        }
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [inputQueryTrimmed, loadMovies]);

  const movieSelectedHandler = (movieSel: IMovie): void => {
    setSelectedMovie(movieSel);
  };

  const queryOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInputQuery(event.target.value);
    setInputQueryTrimmed(event.target.value.trim());
  };

  const onSearchClicked = (): void => {
    loadMovies();
  };

  const onPageNoChanged = (_: object, page: number): void => {
    loadMovies(page);
  };

  const renderMovies = (): ReactNode => {
    return (
      <section className={globStyles.movies}>
        {
          movies.map(movie => {
            return (
              <Movie
                key={movie.imdbID}
                title={movie.title}
                body={movie.actors}
                year={movie.year}
                clicked={() => movieSelectedHandler(movie)}
              />
            );
          })
        }
      </section>
    );
  };

  const renderError = (): ReactNode | null => {
    return movError ? (
      <p className={globStyles['error-text']}>
        {movError}
      </p>
    ) : null;
  };

  const renderContent = (): ReactNode | null => {
    return !isLoading ? (
      <div>
        <div className={styles['search-input']}>
          <span className={globStyles['margin-r-30']}>
            <TextField
              label="Search OMDB"
              value={inputQuery}
              onChange={queryOnChange}
            />
          </span>
          <Button variant="outlined" color="primary" onClick={onSearchClicked} disabled={!inputQueryTrimmed}>
            Search
          </Button>
        </div>
        {wasLastSearchSuccess ? <Pagination count={10} onChange={onPageNoChanged} page={currentPage} /> : null}
        {renderMovies()}
        <section>
          {selectedMovie && !movError ? <MovieDetails selectedMovie={selectedMovie} /> : null}
          {(!selectedMovie && !movError && movies.length) ? <p>{TextConstants.CLICKTOSEEDETAILS}</p> : null}
        </section>
        {renderError()}
        {movInfo ? <p>{movInfo}</p> : null}
      </div>
    ) : null;
  };

  return (
    <>
      {isLoading && <MovieLoadingSkeleton />}
      {renderContent()}
    </>
  );
};

export default MovieSearch;