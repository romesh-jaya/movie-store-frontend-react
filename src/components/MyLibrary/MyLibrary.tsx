/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback, ReactNode, ChangeEvent, useEffect, ReactElement } from 'react';
import MaterialTable from 'material-table';
import { Button, Chip, FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';

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
import NumberRangeInput from '../Controls/Input/NumberRangeInput/NumberRangeInput';
import TableIcons from '../../constants/TableIcons';
import AlertConfirmation from '../UI/AlertConfirmation/AlertConfirmation';

const pageSize = 10;

interface ISearchInfo {
  searchTitle?: string;
  searchType?: string;
  searchYearExact?: number;
  searchYearFrom?: number;
  searchYearTo?: number;
  searchGenre?: string;
  searchPgRating?: string;
};

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
  // Search related:
  const [searchTitle, setSearchTitle] = useState('');
  const [searchType, setSearchType] = useState('');
  const [errorTextSearchYear, setErrorTextSearchYear] = useState('');
  const [searchYearInput, setSearchYearInput] = useState<string>('');
  const [searchYearExact, setSearchYearExact] = useState<number | undefined>();
  const [searchYearFrom, setSearchYearFrom] = useState<number | undefined>();
  const [searchYearTo, setSearchYearTo] = useState<number | undefined>();
  const [searchYearIsBetweenValuesIncomplete, setSearchYearIsBetweenValuesIncomplete] = useState(false);
  const [searchGenre, setSearchGenre] = useState('');
  const [searchPgRating, setSearchPgRating] = useState('');

  const isSearchTextValid = useCallback((): boolean => {
    return !!(searchTitle.trim() || searchType.trim() || searchYearExact || searchYearFrom || searchYearTo);
  }, [searchTitle, searchType, searchYearExact, searchYearFrom, searchYearTo]);

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

  const newSearch = useCallback((): void => {
    if (isSearchTextValid()) {
      // validations
      if (searchYearIsBetweenValuesIncomplete) {
        setErrorTextSearchYear(TextConstants.YEARINVALID1);
        return;
      }
      if (searchYearFrom && searchYearTo && (searchYearFrom >= searchYearTo)) {
        setErrorTextSearchYear(TextConstants.YEARINVALID2);
        return;
      }
      if ((searchYearExact && searchYearExact.toString().length !== 4) ||
        (searchYearFrom && searchYearFrom.toString().length !== 4) ||
        (searchYearTo && searchYearTo.toString().length !== 4)) {
        setErrorTextSearchYear(TextConstants.YEARINVALID3);
        return;
      }

      const searchInfo: ISearchInfo = {};
      if (searchTitle) {
        searchInfo.searchTitle = searchTitle.trim();
      }
      if (searchType) {
        searchInfo.searchType = searchType.trim();
      }
      if (searchYearExact) {
        searchInfo.searchYearExact = searchYearExact;
      }
      if (searchYearFrom) {
        searchInfo.searchYearFrom = searchYearFrom;
      }
      if (searchYearTo) {
        searchInfo.searchYearTo = searchYearTo;
      }
      if (searchGenre) {
        searchInfo.searchGenre = searchGenre;
      }
      if (searchPgRating) {
        searchInfo.searchPgRating = searchPgRating;
      }

      setLastSearchInfo(searchInfo);
    }
  }, [isSearchTextValid, searchGenre, searchPgRating, searchTitle, searchType, searchYearExact, searchYearFrom, searchYearIsBetweenValuesIncomplete, searchYearTo]);

  useEffect(() => {
    if (lastSearchInfo) {
      queryMovies();
    }
  }, [lastSearchInfo, queryMovies]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    switch (event.target.name) {
      case 'searchTitle':
        setSearchTitle(event.target.value);
        break;
      case 'searchGenre':
        setSearchGenre(event.target.value);
        break;
      case 'searchPgRating':
        setSearchPgRating(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleChangeSearchYear = (_: string, isBetweenValuesIncomplete: boolean, value: string, valueSingle?: number,
    valueFrom?: number, valueTo?: number): void => {
    setSearchYearInput(value);
    setSearchYearExact(valueSingle);
    setSearchYearFrom(valueFrom);
    setSearchYearTo(valueTo);
    setSearchYearIsBetweenValuesIncomplete(isBetweenValuesIncomplete);
    setErrorTextSearchYear('');
  };

  const handleChangeSearchType = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>): void => {
    setSearchType(event.target.value as string);
  };

  const clearFields = (): void => {
    setSearchTitle('');
    setSearchType('');
    setSearchYearInput('');
    setSearchGenre('');
    setSearchPgRating('');
  };

  const onSearchClicked = (): void => {
    newSearch();
  };

  const onResetClicked = (): void => {
    clearFields();
  };

  const onDeleteClicked = (data: IMovie | IMovie[]): void => {
    setShowDeleteConfirm(true);
    if (Array.isArray(data)) {
      setMovToDelete(data);
    } else {
      setMovToDelete([data]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' || event.key === 'NumpadEnter') {
      newSearch();
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

  const renderButtons = (): ReactNode => (
    <div className='top-spacer'>
      <span className='right-spacer'>
        <Button
          disabled={!isSearchTextValid()}
          onClick={onSearchClicked}
          color="primary"
          variant="contained"
          autoFocus
        >
          Search
        </Button>
      </span>
      <span className='right-spacer'>
        <Button
          onClick={onResetClicked}
          color="secondary"
          variant="contained"
        >
          Reset
        </Button>
      </span>
    </div>
  );

  const renderSearch = (): ReactNode => (
    <>
      <Card className={styles['card-style']}>
        <Typography className={styles['card-title']} variant="h5" color="textSecondary" gutterBottom>
          Search Library
        </Typography>
        <div className={styles['label-and-input-div']}>
          <label htmlFor="searchTitle">
            Title
            <div className="inter-control-spacing">
              <input
                type="text"
                name="searchTitle"
                value={searchTitle}
                className={styles['input-style-add-user']}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </label>
        </div>
        <div className={styles['label-and-input-div']}>
          <label htmlFor="searchType">
            Type
            <FormControl variant="outlined" className="inter-control-spacing">
              <Select
                className={styles['input-style-add-user']}
                value={searchType}
                onChange={handleChangeSearchType}
                name="searchType"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={MovieType.Movie}>Movie</MenuItem>
                <MenuItem value={MovieType.TvSeries}>TV Series</MenuItem>
              </Select>
            </FormControl>
          </label>
        </div>
        <div className={styles['label-and-input-div']}>
          <label htmlFor="searchYear">
            Year
            <div className="inter-control-spacing">
              <NumberRangeInput
                name="searchYear"
                classNameCustom='input-style-add-user'
                value={searchYearInput}
                handleReturnValue={handleChangeSearchYear}
                enterPressed={newSearch}
              />
            </div>
          </label>
          <div className="error-text-small">
            <small>{errorTextSearchYear}</small>
          </div>
        </div>
        {renderButtons()}
      </Card>
    </>
  );

  const renderContent = (): ReactNode => {
    return (
      <>
        {renderSearch()}
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
      {isLoading ? <MovieLoadingSkeleton /> : renderContent()}
    </>
  );
};

export default MyLibrary;
