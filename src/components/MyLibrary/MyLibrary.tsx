import React, { useState, useCallback, useEffect, ReactElement } from 'react';

import globStyles from '../../index.module.scss';
import { TextConstants } from '../../constants/TextConstants';
import axios from '../../axios';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import LibrarySearchBox from './LibrarySearchBox/LibrarySearchBox';
import { ISearchInfo } from '../../interfaces/ISearchInfo';
import IMovieLibrary from '../../interfaces/IMovieLibrary';
import { isErrorResponse } from '../../types/ErrorResponse';
import MovieTable from '../Movies/MovieTable/MovieTable';
import { pageSize } from '../../constants/Constants';

const MyLibrary: React.FC = () => {
  const [movies, setMovies] = useState<IMovieLibrary[]>([]);
  const [movError, setMovError] = useState('');
  const [movInfo, setMovInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchInfo, setLastSearchInfo] = useState<
    ISearchInfo | undefined
  >();
  const [lastSearchMovieCount, setLastSearchMovieCount] = useState<number>(0);

  const queryMovies = useCallback(
    async (pageNo?: number): Promise<void> => {
      const page = pageNo ?? 1;
      const newSearchInfo = {
        ...lastSearchInfo,
        currentPage: page - 1, // Note: the page always starts at 1 in UI, but 0 in the server
        pageSize,
      };
      setIsLoading(true);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_SERVER}/movies`,
          { params: newSearchInfo }
        );

        setCurrentPage(page);
        if (page === 1 && !response.data.movies.movies.length) {
          // Perform this for first query only
          setMovies([]);
          setMovError('');
          setMovInfo(TextConstants.NOMOVIESFOUND);
          setLastSearchMovieCount(0);
          return;
        }

        setMovies(response.data.movies.movies);
        setMovError('');
        setMovInfo('');
        setLastSearchMovieCount(response.data.movies.movieCount[0].count);
      } catch (err) {
        setMovies([]);
        setMovInfo('');

        if (isErrorResponse(err)) {
          setMovError(
            `${TextConstants.MOVIELOADERROR}: ${err.response.data.Error}`
          );
        } else {
          setMovError(TextConstants.MOVIELOADERROR);
        }
        setLastSearchMovieCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [lastSearchInfo, pageSize]
  );

  const removeMovie = (imdbIDToRemove: string) => {
    setMovies((moviesOld) =>
      moviesOld.filter((movieOld) => movieOld.imdbID !== imdbIDToRemove)
    );
    setLastSearchMovieCount((count) => count - 1);
  };

  const exportMovies = async (): Promise<IMovieLibrary[]> => {
    const newSearchInfo = {
      ...lastSearchInfo,
      queryAll: true,
    };
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_SERVER}/movies`,
        { params: newSearchInfo }
      );
      if (!response.data.movies.movies.length) {
        setMovError('No movies returned from server.');
        return [];
      }
      setMovError('');
      return response.data.movies.movies;
    } catch (err) {
      if (isErrorResponse(err)) {
        setMovError(
          `${TextConstants.MOVIELOADERROR}: ${err.response.data.Error}`
        );
      } else {
        setMovError(TextConstants.MOVIELOADERROR);
      }
    } finally {
      setIsLoading(false);
    }
    return [];
  };

  const handleChangePage = (page: number): void => {
    queryMovies(page);
  };

  useEffect(() => {
    if (lastSearchInfo) {
      queryMovies();
    }
  }, [lastSearchInfo, queryMovies]);

  const renderContent = (): ReactElement => {
    return (
      <>
        {lastSearchMovieCount > 0 && (
          <MovieTable
            lastSearchMovieCount={lastSearchMovieCount}
            currentPage={currentPage}
            pageSize={pageSize}
            movies={movies.map((movie) => ({
              title: movie.title,
              imdbID: movie.imdbID,
            }))}
            handleChangePage={handleChangePage}
            removeMovie={removeMovie}
            resultsFoundText={`${lastSearchMovieCount} results found`}
          />
        )}

        {movError && <p className={globStyles['error-text']}>{movError}</p>}
        {movInfo && <p>{movInfo}</p>}
      </>
    );
  };

  return (
    <>
      <LibrarySearchBox
        enableExportButton={!!lastSearchMovieCount}
        setLastSearchInfo={setLastSearchInfo}
        exportMovies={exportMovies}
      />
      {isLoading ? <LoadingSkeleton /> : renderContent()}
    </>
  );
};

export default MyLibrary;
