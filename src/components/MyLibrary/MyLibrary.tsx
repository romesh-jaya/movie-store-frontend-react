import React, { useState, useCallback, useEffect, ReactElement } from 'react';

import globStyles from '../../index.module.scss';
import { TextConstants } from '../../constants/TextConstants';
import axios from '../../axios';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import AlertConfirmation from '../UI/AlertConfirmation/AlertConfirmation';
import LibrarySearchBox from './LibrarySearchBox/LibrarySearchBox';
import { ISearchInfo } from '../../interfaces/ISearchInfo';
import IMovieLibrary from '../../interfaces/IMovieLibrary';
import MovieDetails from '../Movies/MovieDetails/MovieDetails';
import { isErrorResponse } from '../../types/ErrorResponse';
import MovieTable from './MovieTable/MovieTable';

const MyLibrary: React.FC = () => {
  const [movies, setMovies] = useState<IMovieLibrary[]>([]);
  const [movError, setMovError] = useState('');
  const [movInfo, setMovInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchInfo, setLastSearchInfo] = useState<
    ISearchInfo | undefined
  >();
  const [lastSearchMovieCount, setLastSearchMovieCount] = useState<number>(0);
  const [movToDelete, setMovToDelete] = useState<IMovieLibrary[] | undefined>();
  const [selectedMovieIMDBId, setSelectedMovieIMDBId] = useState('');
  const [pageSize, setPageSize] = React.useState(10);

  const queryMovies = useCallback(
    async (pageNo?: number): Promise<void> => {
      const page = pageNo ?? 1;
      const newSearchInfo = {
        ...lastSearchInfo,
        currentPage: page - 1, // Note: the page always starts at 1 in Material UI, but 0 in the server
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

  const deleteMovies = useCallback(async (): Promise<void> => {
    const idArray = movToDelete?.map((movie) => movie.id);

    if (idArray) {
      setMovError('');
      setIsLoading(true);
      try {
        await axios.delete(`${import.meta.env.VITE_NODE_SERVER}/movies`, {
          params: { idArray },
        });
        setShowDeleteConfirm(false);
        await queryMovies(currentPage);
      } catch (err) {
        if (isErrorResponse(err)) {
          setMovError(
            `${TextConstants.MOVIEDELETEERROR}: ${err.response.data.Error}`
          );
        } else {
          setMovError(TextConstants.MOVIEDELETEERROR);
        }
        setShowDeleteConfirm(false);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentPage, movToDelete, queryMovies]);

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

  const handleClickTitle = (imdbID: string): void => {
    setSelectedMovieIMDBId(imdbID);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void => {
    // Note: the page always starts at 1 in Material UI
    queryMovies(page + 1);
  };

  const handleChangeRowsPerPage = (pageSizeVal: number): void => {
    setPageSize(pageSizeVal);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (lastSearchInfo) {
      queryMovies();
    }
  }, [lastSearchInfo, queryMovies]);

  const onDeleteClicked = (data: IMovieLibrary | IMovieLibrary[]): void => {
    setShowDeleteConfirm(true);
    if (Array.isArray(data)) {
      setMovToDelete(data);
    } else {
      setMovToDelete([data]);
    }
  };

  const onCancelledDelete = (): void => {
    setShowDeleteConfirm(false);
  };

  const renderConfirmModal = (): ReactElement => {
    return (
      <AlertConfirmation
        message="Are you sure you wish to delete these movies?"
        title="Delete"
        oKButtonText="Delete"
        onConfirmed={deleteMovies}
        onCancelled={onCancelledDelete}
      />
    );
  };

  const renderContent = (): ReactElement => {
    return (
      <>
        {lastSearchMovieCount > 0 && (
          <>
            <MovieTable
              lastSearchMovieCount={lastSearchMovieCount}
              currentPage={currentPage}
              pageSize={pageSize}
              movies={movies}
              onDeleteClicked={onDeleteClicked}
              handleChangePage={handleChangePage}
              handleClickTitle={handleClickTitle}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
            {selectedMovieIMDBId && (
              <MovieDetails
                selectedMovieIMDBId={selectedMovieIMDBId}
                closeDrawer={() => setSelectedMovieIMDBId('')}
              />
            )}
          </>
        )}
        {showDeleteConfirm && renderConfirmModal()}
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
