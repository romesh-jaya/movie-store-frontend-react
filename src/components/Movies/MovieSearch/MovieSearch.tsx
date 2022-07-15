import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import axios from '../../../axios';
import styles from './movieSearch.module.css';
import globStyles from '../../../index.module.scss';
import LoadingSkeleton from '../../LoadingSkeleton/LoadingSkeleton';
import { TextConstants } from '../../../constants/TextConstants';
import { pageSize, SEARCH_URL } from '../../../constants/Constants';
import { isErrorResponse } from '../../../types/ErrorResponse';
import { getSettingValue } from '../../../state/settings';
import { MovieTableInfo } from '../../../types/MovieTableInfo';
import MovieTable from '../MovieTable/MovieTable';

const MovieSearch: React.FC = () => {
  const [movies, setMovies] = useState<MovieTableInfo[]>([]);
  const [movError, setMovError] = useState('');
  const [movInfo, setMovInfo] = useState('');
  const [selectedMovieIMDBId, setSelectedMovieIMDBId] = useState('');
  const [inputQuery, setInputQuery] = useState('');
  const [inputQueryTrimmed, setInputQueryTrimmed] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchMovieCount, setLastSearchMovieCount] = useState(0);
  const apiKeySetting = getSettingValue('apiKey');

  const loadMovies = useCallback(
    async (pageNo?: number): Promise<void> => {
      const filteredMovies: MovieTableInfo[] = [];
      const page = pageNo ? `&page=${pageNo.toFixed(0)}` : '';

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${SEARCH_URL}?apikey=${apiKeySetting}&s=${inputQueryTrimmed}${page}`
        );
        if (!response.data || response.data.Response === 'False') {
          setSelectedMovieIMDBId('');
          setMovies([]);
          setLastSearchMovieCount(0);
          setMovError('');
          setMovInfo(TextConstants.NOMOVIESFOUND);
          setIsLoading(false);

          if (pageNo) {
            setCurrentPage(pageNo);
          }
          return;
        }

        const fetchedMovies = response.data;

        // get unique values as there are duplicates in the results returned from OMDB at times
        fetchedMovies.Search.forEach((movie: any) => {
          let matchFound = false;
          filteredMovies.forEach((filteredMovie) => {
            if (filteredMovie === movie.imdbID) {
              matchFound = true;
            }
          });
          if (!matchFound) {
            filteredMovies.push({
              imdbID: movie.imdbID,
              title: movie.Title,
            });
          }
        });

        setSelectedMovieIMDBId('');
        setMovies(filteredMovies);
        setLastSearchMovieCount(fetchedMovies.totalResults);
        setMovError('');
        setMovInfo('');
        setIsLoading(false);

        if (!pageNo) {
          setCurrentPage(1);
        } else {
          setCurrentPage(pageNo);
        }
      } catch (err) {
        setSelectedMovieIMDBId('');
        setMovies([]);
        setLastSearchMovieCount(0);
        setMovInfo('');
        setIsLoading(false);

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

  const queryOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setInputQuery(event.target.value);
    setInputQueryTrimmed(event.target.value.trim());
  };

  const onSearchClicked = (): void => {
    loadMovies();
  };

  const onPageNoChanged = (page: number): void => {
    loadMovies(page);
  };

  const renderMovies = (): ReactElement => {
    return (
      <>
        {lastSearchMovieCount > 0 && (
          <MovieTable
            lastSearchMovieCount={lastSearchMovieCount}
            currentPage={currentPage}
            pageSize={pageSize}
            movies={movies}
            handleChangePage={onPageNoChanged}
            resultsFoundText={`${lastSearchMovieCount} results found`}
          />
        )}
      </>
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
        {renderMovies()}
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
