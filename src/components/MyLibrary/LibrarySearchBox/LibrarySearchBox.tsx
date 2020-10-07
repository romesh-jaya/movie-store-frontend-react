/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback, ReactNode, ChangeEvent, ReactElement } from 'react';
import { Button, FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';

import styles from './LibrarySearchBox.css';
import { TextConstants } from '../../../constants/TextConstants';
import { MovieType } from '../../../enums/MovieType';
import NumberRangeInput from '../../Controls/Input/NumberRangeInput/NumberRangeInput';
import GenreSelectModal from '../GenreSelectModal/GenreSelectModal';
import { ISearchInfo } from '../../../interfaces/ISearchInfo';

interface IProps {
  setLastSearchInfo: (searchInfo: ISearchInfo) => void;
}

const LibrarySearchBox: React.FC<IProps> = (props) => {
  const [showGenresModal, setShowGenresModal] = useState(false);
  // Search related:
  const [searchTitle, setSearchTitle] = useState('');
  const [searchType, setSearchType] = useState('');
  const [errorTextSearchYear, setErrorTextSearchYear] = useState('');
  const [searchYearInput, setSearchYearInput] = useState<string>('');
  const [searchYearExact, setSearchYearExact] = useState<number | undefined>();
  const [searchYearFrom, setSearchYearFrom] = useState<number | undefined>();
  const [searchYearTo, setSearchYearTo] = useState<number | undefined>();
  const [searchYearIsBetweenValuesIncomplete, setSearchYearIsBetweenValuesIncomplete] = useState(false);
  const [searchGenres, setSearchGenres] = useState<string[]>([]);
  const [searchYearDisabled, setSearchYearDisabled] = useState(true); // Disable search year unless type=Movie is chosen

  const { setLastSearchInfo } = props;

  const isSearchTextValid = useCallback((): boolean => {
    return !!(searchTitle.trim() || searchType.trim() || searchYearExact || searchYearFrom || searchYearTo || searchGenres.length);
  }, [searchGenres.length, searchTitle, searchType, searchYearExact, searchYearFrom, searchYearTo]);


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
      if (searchGenres) {
        searchInfo.searchGenres = searchGenres;
      }
      setLastSearchInfo(searchInfo);
    }
  }, [isSearchTextValid, searchGenres, searchTitle, searchType, searchYearExact, searchYearFrom, searchYearIsBetweenValuesIncomplete, searchYearTo, setLastSearchInfo]);

  const handleChangeSearchTitle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTitle(event.target.value);
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
    const type = event.target.value as string;
    setSearchType(type);
    if (type === MovieType.Movie) {
      setSearchYearDisabled(false);
    } else {
      setSearchYearDisabled(true);
      setSearchYearInput('');
      setSearchYearExact(undefined);
      setSearchYearFrom(undefined);
      setSearchYearTo(undefined);
      setSearchYearIsBetweenValuesIncomplete(false);
      setErrorTextSearchYear('');
    }
  };

  const clearFields = (): void => {
    setSearchTitle('');
    setSearchType('');
    setSearchYearInput('');
    setSearchGenres([]);
  };

  const onSearchClicked = (): void => {
    newSearch();
  };

  const onResetClicked = (): void => {
    clearFields();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' || event.key === 'NumpadEnter') {
      newSearch();
    }
  };

  const onGenresClicked = (): void => {
    setShowGenresModal(true);
  };

  const onCancelledGenreSelect = (): void => {
    setShowGenresModal(false);
  };

  const newGenresSelected = (genres: string[]): void => {
    setSearchGenres(genres);
    setShowGenresModal(false);
  };

  const renderGenresModal = (): ReactElement | null => showGenresModal ? (
    <GenreSelectModal
      initialGenres={searchGenres}
      onConfirmed={newGenresSelected}
      onCancelled={onCancelledGenreSelect}
    />
  ) : null;

  const renderButtons = (): ReactNode => (
    <div className={styles['button-div']}>
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
      <Button
        onClick={onResetClicked}
        color="secondary"
        variant="contained"
      >
        Reset
      </Button>
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
                className={styles['input-style-search']}
                onChange={handleChangeSearchTitle}
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
                className={styles['input-style-search']}
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
                disabled={searchYearDisabled}
                classNameCustom='input-style-search'
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
        <div className={styles['label-and-input-div']}>
          <label htmlFor="searchGenres">
            Genres
            <div className="inter-control-spacing">
              <span className={styles['genre-output']}>
                <input
                  disabled
                  type="text"
                  name="searchGenres"
                  value={searchGenres.join(', ')}
                  className={styles['input-style-search-genre']}
                />
              </span>
              <span className={styles['genre-button']}>
                <Button
                  onClick={onGenresClicked}
                  color="secondary"
                  variant="contained"
                >
                  Genres...
                </Button>
              </span>
            </div>
          </label>
        </div>
        {renderButtons()}
      </Card>
    </>
  );

  const renderContent = (): ReactElement => {
    return (
      <>
        {renderSearch()}
        {renderGenresModal()}
      </>
    );
  };

  return renderContent();
};

export default LibrarySearchBox;
