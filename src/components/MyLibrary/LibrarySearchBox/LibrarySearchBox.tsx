/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useCallback, ReactNode, ChangeEvent, ReactElement, useEffect, useContext } from 'react';
import { Button, FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import _ from 'lodash';
import { ExportToCsv } from 'export-to-csv';

import { useAuth0 } from '@auth0/auth0-react';
import styles from './LibrarySearchBox.css';
import * as globStyles from '../../../index.css';
import { TextConstants } from '../../../constants/TextConstants';
import { MovieType } from '../../../enums/MovieType';
import NumberRangeInput from '../../Controls/Input/NumberRangeInput/NumberRangeInput';
import GenreSelectModal from '../GenreSelectModal/GenreSelectModal';
import { ISearchInfo } from '../../../interfaces/ISearchInfo';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';
import INameValue from '../../../interfaces/INameValue';
import SettingsContext from '../../../context/SettingsContext';
import {isAdmin} from '../../../utils/AuthUtil';

interface IProps {
  enableExportButton : boolean;
  setLastSearchInfo: (searchInfo: ISearchInfo) => void;
  exportMovies : () => Promise<IMovieLibrary[]>;
}

const LibrarySearchBox: React.FC<IProps> = (props) => {
  const [showGenresModal, setShowGenresModal] = useState(false);
  // Search related:
  const [searchTitle, setSearchTitle] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('');
  const [errorTextSearchYear, setErrorTextSearchYear] = useState('');
  const [searchYearInput, setSearchYearInput] = useState<string>('');
  const [searchYearExact, setSearchYearExact] = useState<number | undefined>();
  const [searchYearFrom, setSearchYearFrom] = useState<number | undefined>();
  const [searchYearTo, setSearchYearTo] = useState<number | undefined>();
  const [searchYearIsBetweenValuesIncomplete, setSearchYearIsBetweenValuesIncomplete] = useState(false);
  const [searchGenres, setSearchGenres] = useState<string[]>([]);
  const settings = useContext(SettingsContext);
  const languagesSetting = settings.find(setting => setting.name === 'languages');
  const languages = languagesSetting && languagesSetting.value.split(',') || [];
  const { user } = useAuth0();

  const { enableExportButton, setLastSearchInfo, exportMovies } = props;

  const isSearchTextValid = useCallback((): boolean => {
    return !!(searchTitle.trim() || searchType.trim() || searchYearExact || searchYearFrom || searchYearTo || 
    searchGenres.length || searchLanguage);
  }, [searchGenres.length, searchLanguage, searchTitle, searchType, searchYearExact, searchYearFrom, searchYearTo]);


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
      if (searchLanguage) {
        searchInfo.searchLanguage = searchLanguage;
      }
      setLastSearchInfo(searchInfo);
    }
  }, [isSearchTextValid, searchGenres, searchLanguage, searchTitle, searchType, searchYearExact, searchYearFrom, searchYearIsBetweenValuesIncomplete, searchYearTo, setLastSearchInfo]);

  const handleChangeSearchTitle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTitle(event.target.value);
  };

  const handleChangeSearchYear = (__: string, isBetweenValuesIncomplete: boolean, value: string, valueSingle?: number,
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
    setSearchYearInput('');
    setSearchYearExact(undefined);
    setSearchYearFrom(undefined);
    setSearchYearTo(undefined);
    setSearchYearIsBetweenValuesIncomplete(false);
    setErrorTextSearchYear('');
  };

  const handleChangeSearchLanguage = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>): void => {
    const language = event.target.value as string;
    setSearchLanguage(language);
  };

  const clearFields = (): void => {
    setSearchTitle('');
    setSearchType('');
    setSearchYearInput('');
    setSearchGenres([]);
    setSearchYearExact(undefined);
    setSearchYearFrom(undefined);
    setSearchYearTo(undefined);
    setSearchYearIsBetweenValuesIncomplete(false);
    setErrorTextSearchYear('');
    setSearchLanguage('');
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

  const onExportClicked = async (): Promise<void> => {
    const exportDataVal = await exportMovies();
    if (exportDataVal.length){
      // Note: setting headers property in ExportToCsv's options didn't work as of 2020-Oct
      // Thus we need a manual workaround to convert the keys to Title case
      const keys = Object.keys(exportDataVal[0]);
      const keysMinusId = keys.filter(key => key !== 'id');
      // convert keys to Title case
      const formattedKeys : INameValue[] = keysMinusId.map(key => ({name: key, value: _.startCase(key)})); 

      // create new data with capitalized keys
      const capitalizedKeyData = exportDataVal.map(row=> {
        const retVal : any = {};
        formattedKeys.forEach(key => {
          retVal[key.value] = row[key.name as keyof IMovieLibrary];
        }
        );
        return retVal;
      });

      const formattedData = capitalizedKeyData.map(row => {
        // convert array types to semicolon seperated
        const newData = {
          ...row,
          Genre: row.Genre.join(';'),
          Languages: row.Languages.join(';'),
        };
        return newData;
      });

      const options = { 
        filename: 'Export.csv',
        useKeysAsHeaders: true
      };

      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(formattedData);
    }
  };

  useEffect(() => {
    // Set default type
    setSearchType(MovieType.Movie);
  }, []);

  const renderGenresModal = (): ReactElement | null => showGenresModal ? (
    <GenreSelectModal
      initialGenres={searchGenres}
      onConfirmed={newGenresSelected}
      onCancelled={onCancelledGenreSelect}
    />
  ) : null;

  const renderButtons = (): ReactNode => (
    <div className={styles['button-div']}>
      <span className={globStyles['right-spacer']}>
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
      <span className={globStyles['right-spacer']}>
        <Button
          onClick={onResetClicked}
          color="secondary"
          variant="contained"
        >
          Reset
        </Button>
      </span>
      {
        isAdmin(user.email) ? (
          <Button
            disabled={!enableExportButton}
            onClick={onExportClicked}
            color="secondary"
            variant="contained"
          >
            Export to CSV
          </Button>
        ) : null
      }
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
          <label htmlFor="searchLanguage">
            Language
            <FormControl variant="outlined" className="inter-control-spacing">
              <Select
                className={styles['input-style-search']}
                value={searchLanguage}
                onChange={handleChangeSearchLanguage}
                name="searchLanguage"
              >
                <MenuItem value="">
                  <em key="None">None</em>
                </MenuItem>
                {languages.map(language => <MenuItem value={language} key={language}>{language}</MenuItem>)}
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
                disabled={searchType !== MovieType.Movie}
                classNameCustom='input-style-search'
                value={searchYearInput}
                handleReturnValue={handleChangeSearchYear}
                enterPressed={newSearch}
              />
            </div>
          </label>
          <div className={globStyles['error-text-small']}>
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
