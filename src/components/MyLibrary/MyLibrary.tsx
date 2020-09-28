/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback, ReactNode, forwardRef, ChangeEvent } from 'react';

import MaterialTable from 'material-table';
import { Button, Chip, FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import styles from './MyLibrary.css';
import * as globStyles from '../../index.css';
import { TEXT_CONSTANTS } from '../../constants/constants';
import axios from '../../axios';
import IMovie from '../../interfaces/IMovie';
import MovieDetails from '../Movies/MovieDetails/MovieDetails';
import MovieLoadingSkeleton from '../Movies/MovieLoadingSkeleton';
import { MovieType } from '../../enums/MovieType';
import NumberRangeInput from '../Controls/Input/NumberRangeInput/NumberRangeInput';

const errorText = 'Error while retrieving movie data.';

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
  const [currentPage, setCurrentPage] = useState(1);
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

  const tableIcons = {
    Add: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ViewColumn {...props} ref={ref} />)
  };

  const searchMovies = useCallback((): void => {
    // validations
    if (searchYearIsBetweenValuesIncomplete) {
      setErrorTextSearchYear(TEXT_CONSTANTS.YEARINVALID1);
      return;
    }
    if (searchYearFrom && searchYearTo && (searchYearFrom >= searchYearTo)) {
      setErrorTextSearchYear(TEXT_CONSTANTS.YEARINVALID2);
      return;
    }
    if ((searchYearExact && searchYearExact.toString().length !== 4) ||
      (searchYearFrom && searchYearFrom.toString().length !== 4) ||
      (searchYearTo && searchYearTo.toString().length !== 4)) {
      setErrorTextSearchYear(TEXT_CONSTANTS.YEARINVALID3);
      return;
    }

    setIsLoading(true);

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

    axios.get(`${process.env.REACT_APP_NODE_SERVER}/movies`,
      { params: searchInfo })
      .then((response: any) => {
        if (!response.data.length) {
          setSelectedMovie(undefined);
          setMovies([]);
          setMovError('');
          setMovInfo(TEXT_CONSTANTS.NOMOVIESFOUND);
          setIsLoading(false);
          return;
        }

        setSelectedMovie(undefined);
        setMovies(response.data);
        setMovError('');
        setMovInfo('');
        setIsLoading(false);
        setCurrentPage(1);
      })
      .catch((err: any) => {
        console.log(err);

        setSelectedMovie(undefined);
        setMovies([]);
        setMovInfo('');
        setIsLoading(false);
        if (err && err.response && err.response.data && err.response.data.Error) {
          setMovError(`${errorText}: ${err.response.data.Error}`);
        } else {
          setMovError(errorText);
        }
      });
  }, [searchGenre, searchPgRating, searchTitle, searchType, searchYearExact, searchYearFrom, searchYearIsBetweenValuesIncomplete, searchYearTo]);

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

  const renderTable = (): ReactNode | null => {
    return movies.length ? (
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
              rowStyle: { fontSize: '0.95rem' }
            }
          }
          icons={tableIcons}
        />
      </div>
    ) : null;
  };

  const renderError = (): ReactNode | null => {
    return movError ? (
      <p className={globStyles['error-text']}>
        {TEXT_CONSTANTS.MOVIELOADERROR}
        {' '}
        {movError}
      </p>
    ) : null;
  };

  const clearFields = (): void => {
    setSearchTitle('');
    setSearchType('');
    setSearchYearInput('');
    setSearchGenre('');
    setSearchPgRating('');
  };

  const isSearchTextValid = (): boolean => {
    return !!(searchTitle.trim() || searchType.trim() || searchYearExact || searchYearFrom || searchYearTo);
  };

  const onSearchClicked = (): void => {
    searchMovies();
  };

  const onResetClicked = (): void => {
    clearFields();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      searchMovies();
    }
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
                enterPressed={searchMovies}
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