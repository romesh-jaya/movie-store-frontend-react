/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback, ReactNode, useEffect, ReactElement } from 'react';
import MaterialTable from 'material-table';
import {  Chip} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import { Pagination } from '@material-ui/lab';

import styles from './MyLibrary.css';
import * as globStyles from '../../index.css';
import { TextConstants } from '../../constants/TextConstants';
import axios from '../../axios';
import IMovie from '../../interfaces/IMovie';
import MovieDetails from '../Movies/MovieDetails/MovieDetails';
import MovieLoadingSkeleton from '../Movies/MovieLoadingSkeleton';
import { MovieType } from '../../enums/MovieType';
import TableIcons from '../../constants/TableIcons';
import AlertConfirmation from '../UI/AlertConfirmation/AlertConfirmation';
import LibrarySearchBox from './LibrarySearchBox/LibrarySearchBox';
import { ISearchInfo } from '../../interfaces/ISearchInfo';

const pageSize = 10;

const MyLibrary: React.FC = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [movError, setMovError] = useState('');
  const [movInfo, setMovInfo] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<IMovie>();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastSearchInfo, setLastSearchInfo] = useState<ISearchInfo | undefined>();
  const [lastSearchMovieCount, setLastSearchMovieCount] = useState<number | undefined>();
  const [movToDelete, setMovToDelete] = useState<IMovie[] | undefined>();

  const queryMovies = useCallback(async (pageNo?: number): Promise<void> => {
    const page = pageNo ?? 1;
    const newSearchInfo =
    {
      ...lastSearchInfo,
      page: page - 1, // Note: the page always starts at 1 in Material UI, but 0 in the server
      pageSize
    };
    setIsLoading(true);

    try {
      const response = await axios.get(`${process.env.REACT_APP_NODE_SERVER}/movies`,
        { params: newSearchInfo });

      setCurrentPage(page);
      if ((page === 1) && !response.data.movies.movies.length) {
        // Perform this for first query only
        setSelectedMovie(undefined);
        setMovies([]);
        setMovError('');
        setMovInfo(TextConstants.NOMOVIESFOUND);
        setIsLoading(false);
        setLastSearchMovieCount(0);
        return;
      }

      setSelectedMovie(undefined);
      setMovies(response.data.movies.movies);
      setMovError('');
      setMovInfo('');
      setIsLoading(false);
      setLastSearchMovieCount(response.data.movies.movieCount[0].count);

    } catch (err) {
      setSelectedMovie(undefined);
      setMovies([]);
      setMovInfo('');
      setIsLoading(false);
      if (err && err.response && err.response.data && err.response.data.Error) {
        setMovError(`${TextConstants.MOVIELOADERROR}: ${err.response.data.Error}`);
      } else {
        setMovError(TextConstants.MOVIELOADERROR);
      }
      setLastSearchMovieCount(0);
    }

  }, [lastSearchInfo]);

  const deleteMovies = useCallback(async (): Promise<void> => {
    const idArray = movToDelete?.map(movie => movie.id);

    if (idArray) {
      setMovError('');
      setIsLoading(true);
      try {
        await axios.delete(`${process.env.REACT_APP_NODE_SERVER}/movies`,
          { params: { idArray } });
        setShowDeleteConfirm(false);
        await queryMovies(currentPage);
      } catch (err) {
        if (err && err.response && err.response.data && err.response.data.Error) {
          setMovError(`${TextConstants.MOVIEDELETEERROR}: ${err.response.data.Error}`);
        } else {
          setMovError(TextConstants.MOVIEDELETEERROR);
        }
        setShowDeleteConfirm(false);
        setIsLoading(false);
      }
    }
  }, [currentPage, movToDelete, queryMovies]);

  const onPageNoChanged = (_: object, page: number): void => {
    // Note: the page always starts at 1 in Material UI
    queryMovies(page);
  };

  useEffect(() => {
    if (lastSearchInfo) {
      queryMovies();
    }
  }, [lastSearchInfo, queryMovies]);

  const onDeleteClicked = (data: IMovie | IMovie[]): void => {
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

  const renderError = (): ReactNode | null => {
    return movError ? (
      <p className={globStyles['error-text']}>
        {movError}
      </p>
    ) : null;
  };

  const renderConfirmModal = (): ReactElement | null => showDeleteConfirm ? (
    <AlertConfirmation
      message="Are you sure you wish to delete these movies?"
      title="Delete"
      oKButtonText="Delete"
      onConfirmed={deleteMovies}
      onCancelled={onCancelledDelete}
    />
  ) : null;

  const renderTable = (): ReactNode | null => {
    const totalPageCount = Math.ceil((lastSearchMovieCount ?? 0) / pageSize);
    return lastSearchMovieCount ? (
      <div className={styles['table-style']}>
        <MaterialTable
          columns={
            [
              {
                title: 'Title',
                field: 'title',
                width: '45%'
              },
              {
                title: 'Type',
                field: 'type',
                width: '3%',
                render: rowData => <p>{(rowData.type === MovieType.TvSeries) ? 'TV' : 'MOV'}</p>
              },
              {
                title: 'Year',
                field: 'year',
                type: 'numeric',
                width: '3%'
              },
              {
                title: 'Genre',
                field: 'genre',
                width: '39%',
                sorting: false,
                render: rowData => {
                  return (
                    <>
                      {
                        rowData.genre ? rowData.genre?.map((genre: string) => (
                          <span className={globStyles['chip-spacer']}>
                            <Chip label={genre} />
                          </span>
                        )) : null
                      }
                    </>
                  );
                }
              },
              {
                title: 'PG Rating',
                field: 'pGRating',
                width: '10%'
              }
            ]
          }
          data={movies}
          options={
            {
              showTitle: false,
              search: false,
              paging: false,
              sorting: true,
              headerStyle: { fontSize: '1rem' },

              rowStyle: rowData => ({
                backgroundColor: rowData.tableData.checked
                  ? 'rgba(232, 210, 192, 0.5)' : '#fff'
              }),
              selection: true
            }
          }
          actions={
            [
              {
                tooltip: 'Delete selected movies',
                icon: () => <Delete />,
                onClick: (_, data) => onDeleteClicked(data)
              }
            ]
          }
          icons={TableIcons}
        />
        <div className={styles['pagination-style']}>
          <Pagination
            showFirstButton
            showLastButton
            count={totalPageCount}
            onChange={onPageNoChanged}
            page={currentPage}
          />
        </div>
      </div>
    ) : null;
  };

  const renderContent = (): ReactNode => {
    return (
      <>
        {renderTable()}
        <section>
          {selectedMovie && !movError ? <MovieDetails selectedMovie={selectedMovie} /> : null}
        </section>
        {renderConfirmModal()}
        {renderError()}
        {movInfo ? <p>{movInfo}</p> : null}
      </>
    );
  };

  return (
    <>
      <LibrarySearchBox setLastSearchInfo={setLastSearchInfo} />
      {isLoading ? <MovieLoadingSkeleton /> : renderContent()}
    </>
  );
};

export default MyLibrary;
