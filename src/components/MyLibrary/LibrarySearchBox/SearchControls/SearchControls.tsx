import React, { ReactElement, useContext } from 'react';
import {
  Button,
  FormControl,
  MenuItem,
  Popover,
  Select,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';

import SettingsContext from '../../../../context/SettingsContext';
import NumberRangeInput from '../../../Controls/Input/NumberRangeInput/NumberRangeInput';
import styles from '../librarySearchBox.module.css';
import * as globStyles from '../../../../index.module.css';
import { MovieType } from '../../../../enums/MovieType';

interface IProps {
  anchorEl: Element | null;
  searchTitle: string;
  searchType: string;
  searchLanguage: string;
  searchYearInput: string;
  searchGenres: string[];
  errorTextSearchYear: string;
  setAnchorEl: (anchorEl: Element | null) => void;
  handleChangeSearchTitle: (title: string) => void;
  handleKeyDown: (keyName: string) => void;
  handleChangeSearchType: (searchType: string) => void;
  handleChangeSearchLanguage: (language: string) => void;
  handleChangeSearchYear: (
    __: string,
    isBetweenValuesIncomplete: boolean,
    value: string,
    valueSingle?: number,
    valueFrom?: number,
    valueTo?: number
  ) => void;
  onGenresClicked: () => void;
}

const SearchControls: React.FC<IProps> = (props) => {
  const {
    anchorEl,
    searchTitle,
    searchType,
    searchLanguage,
    searchYearInput,
    searchGenres,
    errorTextSearchYear,
    setAnchorEl,
    handleChangeSearchTitle,
    handleKeyDown,
    handleChangeSearchType,
    handleChangeSearchLanguage,
    handleChangeSearchYear,
    onGenresClicked,
  } = props;
  const settings = useContext(SettingsContext);
  const languagesSetting = settings.find(
    (setting) => setting.name === 'languages'
  );
  const languages =
    (languagesSetting && languagesSetting.value.split(',')) || [];

  const handleClickHelpIcon = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = (): void => {
    setAnchorEl(null);
  };

  const renderHelpYear = (): ReactElement => {
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
      <span className={styles.helpicon}>
        <HelpIcon onClick={handleClickHelpIcon} color="primary" />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className={styles.helptext}>
            <div>Value can be entered in the following formats:</div>
            <div>Enter a single year: 2020</div>
            <div>Enter a year to search from: &gt; 2020</div>
            <div>Enter a year to search upto: &lt; 2020</div>
            <div>Enter a range of years: 2010-2020</div>
          </div>
        </Popover>
      </span>
    );
  };

  return (
    <>
      <div className={styles['label-and-input-div']}>
        <label htmlFor="searchTitle">
          Title
          <div className="inter-control-spacing">
            <input
              type="text"
              name="searchTitle"
              value={searchTitle}
              className={styles['input-style-search']}
              onChange={(event) => handleChangeSearchTitle(event.target.value)}
              onKeyDown={(event) => handleKeyDown(event.key)}
            />
          </div>
        </label>
      </div>
      <div className={styles['label-and-input-div']}>
        <label htmlFor="searchType">
          Type
          <div className="inter-control-spacing">
            <FormControl
              variant="outlined"
              className={styles['input-style-form-control']}
            >
              <Select
                className={styles['input-style-select']}
                value={searchType}
                onChange={(event) =>
                  handleChangeSearchType(event.target.value as string)
                }
                name="searchType"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={MovieType.Movie}>Movie</MenuItem>
                <MenuItem value={MovieType.TvSeries}>TV Series</MenuItem>
              </Select>
            </FormControl>
          </div>
        </label>
      </div>
      <div className={styles['label-and-input-div']}>
        <label htmlFor="searchLanguage">
          Language
          <div className="inter-control-spacing">
            <FormControl
              variant="outlined"
              className={styles['input-style-form-control']}
            >
              <Select
                className={styles['input-style-select']}
                value={searchLanguage}
                onChange={(event) =>
                  handleChangeSearchLanguage(event.target.value as string)
                }
                name="searchLanguage"
              >
                <MenuItem value="">
                  <em key="None">None</em>
                </MenuItem>
                {languages.map((language) => (
                  <MenuItem value={language} key={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </label>
      </div>
      <div className={styles['label-and-input-div']}>
        <label htmlFor="searchYear">
          Year
          <div className="inter-control-spacing">
            <NumberRangeInput
              name="searchYear"
              disabled={searchType !== MovieType.Movie}
              classNameCustom="input-style-search"
              value={searchYearInput}
              handleReturnValue={handleChangeSearchYear}
            />
            {renderHelpYear()}
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
            <span className={styles.genre}>
              <input
                disabled
                type="text"
                name="searchGenres"
                value={searchGenres.join(', ')}
                className={styles['input-style-search-genre']}
              />
            </span>
            <span>
              <Button
                onClick={onGenresClicked}
                color="secondary"
                variant="contained"
                classes={{
                  root: styles['genre-button'],
                }}
              >
                Genres...
              </Button>
            </span>
          </div>
        </label>
      </div>
    </>
  );
};

export default SearchControls;
