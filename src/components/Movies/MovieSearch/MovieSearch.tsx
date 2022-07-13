import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';

import axios from '../../../axios';
import Movie from '../Movie/Movie';
import styles from './movieSearch.module.css';
import globStyles from '../../../index.module.scss';
import IMovieSearch from '../../../interfaces/IMovieSearch';
import MovieDetails from '../MovieDetails/MovieDetails';
import LoadingSkeleton from '../../LoadingSkeleton/LoadingSkeleton';
import { TextConstants } from '../../../constants/TextConstants';
import { getMovieDetails } from '../../../utils/MovieUtil';
import { SEARCH_URL } from '../../../constants/Constants';
import { isErrorResponse } from '../../../types/ErrorResponse';
import { getSettingValue } from '../../../state/settings';

const MovieSearch: React.FC = () => {
  const [movies, setMovies] = useState<IMovieSearch[]>([]);
  const [movError, setMovError] = useState('');
  const [movInfo, setMovInfo] = useState('');
  const [wasLastSearchSuccess, setWasLastSearchSuccess] = useState(false);
  const [selectedMovieIMDBId, setSelectedMovieIMDBId] = useState('');
  const [inputQuery, setInputQuery] = useState('');
  const [inputQueryTrimmed, setInputQueryTrimmed] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const apiKeySetting = getSettingValue('apiKey');

  const setSelectedMovieIMDBInternal = (value: string): void => {
    setSelectedMovieIMDBId(value);
  };

  const loadMovies = useCallback(
    async (pageNo?: number): Promise<void> => {
      const filteredMoviesIMDBIds: string[] = [];
      const page = pageNo ? `&page=${pageNo.toFixed(0)}` : '';

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${SEARCH_URL}?apikey=${apiKeySetting}&s=${inputQueryTrimmed}${page}`
        );
        if (!response.data || response.data.Response === 'False') {
          setSelectedMovieIMDBId('');
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
          filteredMoviesIMDBIds.forEach((filteredMovie) => {
            if (filteredMovie === movie.imdbID) {
              matchFound = true;
            }
          });
          if (!matchFound) {
            filteredMoviesIMDBIds.push(movie.imdbID);
          }
        });

        // loop through the filteredMovies to get additional actors info using the OMDB details URL
        const getData = async (): Promise<IMovieSearch[]> => {
          return Promise.all(
            filteredMoviesIMDBIds.map((movie) =>
              getMovieDetails(movie, SEARCH_URL, apiKeySetting)
            )
          );
        };

        const fullMovies = await getData();
        setSelectedMovieIMDBId('');
        setMovies(fullMovies);
        setMovError('');
        setMovInfo('');
        setIsLoading(false);

        if (!pageNo) {
          setCurrentPage(1);
          setWasLastSearchSuccess(true);
        } else {
          setCurrentPage(pageNo);
        }
      } catch (err) {
        setSelectedMovieIMDBId('');
        setMovies([]);
        setMovInfo('');
        setIsLoading(false);

        if (!pageNo) {
          setWasLastSearchSuccess(false);
        }

        if (isErrorResponse(err)) {
          setMovError(
            `${TextConstants.MOVIELOADERROROMDB}: ${err.response.data.Error}`
          );
        } else {
          setMovError(TextConstants.MOVIELOADERROROMDB);
        }
      }
    },
    [apiKeySetting, inputQueryTrimmed]
  );

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

  const movieSelectedHandler = (movieSel: IMovieSearch): void => {
    setSelectedMovieIMDBInternal(movieSel.imdbID);
  };

  const queryOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setInputQuery(event.target.value);
    setInputQueryTrimmed(event.target.value.trim());
  };

  const onSearchClicked = (): void => {
    loadMovies();
  };

  const onPageNoChanged = (_: object, page: number): void => {
    loadMovies(page);
  };

  const renderMovies = (): ReactElement => {
    return (
      <section className={styles.movies}>
        {movies.map((movie) => {
          return (
            <Movie
              key={movie.imdbID}
              title={movie.title}
              body={movie.actors}
              year={movie.year}
              clicked={() => movieSelectedHandler(movie)}
            />
          );
        })}
      </section>
    );
  };

  const renderError = (): ReactElement => {
    return <p className={globStyles['error-text']}>{movError}</p>;
  };

  const renderContent = (): ReactElement | null => {
    if (isLoading) {
      return null;
    }

    return (
      <>
        <div className={styles['search-input']}>
          <span className={globStyles['margin-r-30']}>
            <TextField
              label="Search OMDB"
              value={inputQuery}
              onChange={queryOnChange}
              variant="standard"
            />
          </span>
          <Button
            variant="outlined"
            color="primary"
            onClick={onSearchClicked}
            disabled={!inputQueryTrimmed}
          >
            Search
          </Button>
        </div>
        {wasLastSearchSuccess && (
          <Pagination
            count={10}
            onChange={onPageNoChanged}
            page={currentPage}
          />
        )}
        {renderMovies()}
        {selectedMovieIMDBId && (
          <MovieDetails selectedMovieIMDBId={selectedMovieIMDBId} />
        )}
        <section>
          {!selectedMovieIMDBId && !movError && movies.length > 0 && (
            <p>{TextConstants.CLICKTOSEEDETAILS}</p>
          )}
        </section>
        {movError && renderError()}
        {movInfo && <p>{movInfo}</p>}
      </>
    );
  };

  return (
    <>
      {isLoading && <LoadingSkeleton />}
      {renderContent()}
    </>
  );
};

export default MovieSearch;
