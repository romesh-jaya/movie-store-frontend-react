import React, { useState, useCallback, ReactElement } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { ExportToCsv } from 'export-to-csv';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import styles from './librarySearchBox.module.scss';
import globStyles from '../../../index.module.scss';
import { useAuth0 } from '@auth0/auth0-react';
import { TextConstants } from '../../../constants/TextConstants';
import { MovieType } from '../../../enums/MovieType';
import GenreSelectModal from '../GenreSelectModal/GenreSelectModal';
import { ISearchInfo } from '../../../interfaces/ISearchInfo';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';

import { isAdmin } from '../../../utils/AuthUtil';
import { formatExportData } from '../../../utils/ExportUtil';
import SearchControls from './SearchControls/SearchControls';
import { PREFERS_DARK_MODE_MEDIA_QUERY } from '../../../constants/Constants';
import useMediaQuery from '@mui/material/useMediaQuery';

const exportFileName = 'Export.csv';

interface IProps {
  enableExportButton: boolean;
  setLastSearchInfo: (searchInfo: ISearchInfo) => void;
  exportMovies: () => Promise<IMovieLibrary[]>;
}

const LibrarySearchBox: React.FC<IProps> = (props) => {
  const [showGenresModal, setShowGenresModal] = useState(false);
  // Search related:
  const [searchTitle, setSearchTitle] = useState('');
  const [searchType, setSearchType] = useState<string>(MovieType.Movie);
  const [searchLanguage, setSearchLanguage] = useState('');
  const [errorTextSearchYear, setErrorTextSearchYear] = useState('');
  const [searchYearInput, setSearchYearInput] = useState('');
  const [searchYearExact, setSearchYearExact] = useState<number | undefined>();
  const [searchYearFrom, setSearchYearFrom] = useState<number | undefined>();
  const [searchYearTo, setSearchYearTo] = useState<number | undefined>();
  const [
    searchYearIsBetweenValuesIncomplete,
    setSearchYearIsBetweenValuesIncomplete,
  ] = useState(false);
  const [searchGenres, setSearchGenres] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const { user } = useAuth0();
  const [isBoxExpanded, setIsBoxExpanded] = useState(true);
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery(PREFERS_DARK_MODE_MEDIA_QUERY);
  const boxShadowColor = prefersDarkMode
    ? theme.palette.secondary.dark
    : 'rgb(0 0 0 / 20%)';

  const { enableExportButton, setLastSearchInfo, exportMovies } = props;

  const isSearchTextValid = useCallback((): boolean => {
    return !!(
      searchTitle.trim() ||
      searchType.trim() ||
      searchYearExact ||
      searchYearFrom ||
      searchYearTo ||
      searchGenres.length ||
      searchLanguage
    );
  }, [
    searchGenres.length,
    searchLanguage,
    searchTitle,
    searchType,
    searchYearExact,
    searchYearFrom,
    searchYearTo,
  ]);

  const newSearch = useCallback((): void => {
    if (isSearchTextValid()) {
      // validations
      if (searchYearIsBetweenValuesIncomplete) {
        setErrorTextSearchYear(TextConstants.YEARINVALID1);
        return;
      }
      if (searchYearFrom && searchYearTo && searchYearFrom >= searchYearTo) {
        setErrorTextSearchYear(TextConstants.YEARINVALID2);
        return;
      }
      if (
        (searchYearExact && searchYearExact.toString().length !== 4) ||
        (searchYearFrom && searchYearFrom.toString().length !== 4) ||
        (searchYearTo && searchYearTo.toString().length !== 4)
      ) {
        setErrorTextSearchYear(TextConstants.YEARINVALID3);
        return;
      }

      const searchInfo: ISearchInfo = {
        ...(searchTitle && { searchTitle: searchTitle.trim() }),
        ...(searchType && { searchType: searchType.trim() }),
        ...(searchYearExact && { searchYearExact }),
        ...(searchYearFrom && { searchYearFrom }),
        ...(searchYearTo && { searchYearTo }),
        ...(searchGenres && { searchGenres }),
        ...(searchLanguage && { searchLanguage }),
      };
      setLastSearchInfo(searchInfo);
      setIsBoxExpanded(false);
    }
  }, [
    isSearchTextValid,
    searchGenres,
    searchLanguage,
    searchTitle,
    searchType,
    searchYearExact,
    searchYearFrom,
    searchYearIsBetweenValuesIncomplete,
    searchYearTo,
    setLastSearchInfo,
  ]);

  const handleChangeSearchTitle = (title: string): void => {
    setSearchTitle(title);
  };

  const handleChangeSearchYear = (
    __: string,
    isBetweenValuesIncomplete: boolean,
    value: string,
    valueSingle?: number,
    valueFrom?: number,
    valueTo?: number
  ): void => {
    setSearchYearInput(value);
    setSearchYearExact(valueSingle);
    setSearchYearFrom(valueFrom);
    setSearchYearTo(valueTo);
    setSearchYearIsBetweenValuesIncomplete(isBetweenValuesIncomplete);
    setErrorTextSearchYear('');
  };

  const clearYearFields = () => {
    setSearchYearInput('');
    setSearchYearExact(undefined);
    setSearchYearFrom(undefined);
    setSearchYearTo(undefined);
    setSearchYearIsBetweenValuesIncomplete(false);
    setErrorTextSearchYear('');
  };

  const handleChangeSearchType = (searchType: string): void => {
    setSearchType(searchType);
    clearYearFields();
  };

  const handleChangeSearchLanguage = (language: string): void => {
    setSearchLanguage(language);
  };

  const clearFields = (): void => {
    setSearchTitle('');
    setSearchType('');
    setSearchGenres([]);
    clearYearFields();
    setSearchLanguage('');
  };

  const onResetClicked = (): void => {
    clearFields();
  };

  const handleKeyDown = (keyName: string): void => {
    if (keyName === 'Enter' || keyName === 'NumpadEnter') {
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
    if (exportDataVal.length) {
      // Note: setting headers property in ExportToCsv's options didn't work as of 2020-Oct
      // Thus we need a manual workaround to convert the keys to Title case
      const formattedData = formatExportData(exportDataVal);

      const options = {
        filename: exportFileName,
        useKeysAsHeaders: true,
      };

      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(formattedData);
    }
  };

  const renderButtons = (): ReactElement => (
    <div className={styles['button-div']}>
      <span className={globStyles['right-spacer']}>
        <Button
          id="search-button"
          disabled={!isSearchTextValid()}
          onClick={newSearch}
          color="primary"
          variant="contained"
          autoFocus
        >
          Search
        </Button>
      </span>
      <span className={globStyles['right-spacer']}>
        <Button onClick={onResetClicked} color="secondary" variant="contained">
          Reset
        </Button>
      </span>
      {isAdmin(user) && (
        <Button
          disabled={!enableExportButton}
          onClick={onExportClicked}
          color="secondary"
          variant="contained"
        >
          Export to CSV
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Card
        className={styles['card-style']}
        style={{
          boxShadow: `0px 2px 1px -1px ${boxShadowColor}, 0px 1px 1px 0px ${boxShadowColor}, 0px 1px 3px 0px ${boxShadowColor}`,
        }}
      >
        <Typography
          className={styles['card-title']}
          variant="h5"
          color="textSecondary"
          gutterBottom
        >
          <div className={styles.heading}>
            Search Library
            <Button
              classes={{
                root: `${styles['expand-button']} ${
                  isBoxExpanded ? '' : styles['expand-button-rotated']
                }`,
              }}
              onClick={() => setIsBoxExpanded(!isBoxExpanded)}
            >
              <ExpandMoreIcon />
            </Button>
          </div>
        </Typography>
        {isBoxExpanded && (
          <>
            <SearchControls
              anchorEl={anchorEl}
              searchTitle={searchTitle}
              searchType={searchType}
              searchLanguage={searchLanguage}
              searchYearInput={searchYearInput}
              searchGenres={searchGenres}
              errorTextSearchYear={errorTextSearchYear}
              setAnchorEl={setAnchorEl}
              handleChangeSearchTitle={handleChangeSearchTitle}
              handleKeyDown={handleKeyDown}
              handleChangeSearchType={handleChangeSearchType}
              handleChangeSearchLanguage={handleChangeSearchLanguage}
              handleChangeSearchYear={handleChangeSearchYear}
              onGenresClicked={onGenresClicked}
            />
            {renderButtons()}
          </>
        )}
      </Card>
      {showGenresModal && (
        <GenreSelectModal
          initialGenres={searchGenres}
          onConfirmed={newGenresSelected}
          onCancelled={onCancelledGenreSelect}
        />
      )}
    </>
  );
};

export default LibrarySearchBox;
