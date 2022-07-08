import React, { ReactElement } from 'react';
import Popover from '@mui/material/Popover';
import { QuestionSquareFill } from 'react-bootstrap-icons';

import NumberRangeInput from '../../../Controls/Input/NumberRangeInput/NumberRangeInput';
import styles from '../librarySearchBox.module.scss';
import globStyles from '../../../../index.module.scss';
import { MovieType } from '../../../../enums/MovieType';
import { getSettingValue } from '../../../../state/settings';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';

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
  const languagesSetting = getSettingValue('languages');
  const languages = (languagesSetting && languagesSetting.split(',')) || [];

  const handleClickHelpIcon = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
      <div>
        <Button
          onClick={handleClickHelpIcon}
          variant="outline-primary"
          className={styles['help-button']}
        >
          <QuestionSquareFill className={styles.helpicon} />
        </Button>

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
      </div>
    );
  };

  return (
    <>
      <div className={styles['label-and-input-div']}>
        <label htmlFor="searchTitle">
          Title
          <div className={styles['inter-control-spacing']}>
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
          <div className={styles['inter-control-spacing']}>
            <Form.Select
              className={`${styles['input-style-select']} ${styles['input-style-form-control']}`}
              value={searchType}
              onChange={(event) =>
                handleChangeSearchType(event.target.value as string)
              }
              name="searchType"
            >
              <option value="">All</option>
              <option value={MovieType.Movie}>Movie</option>
              <option value={MovieType.TvSeries}>TV Series</option>
            </Form.Select>
          </div>
        </label>
      </div>
      <div className={styles['label-and-input-div']}>
        <label htmlFor="searchLanguage">
          Language
          <div className={styles['inter-control-spacing']}>
            <Form.Select
              className={`${styles['input-style-select']} ${styles['input-style-form-control']}`}
              value={searchLanguage}
              onChange={(event) =>
                handleChangeSearchLanguage(event.target.value as string)
              }
              name="searchLanguage"
            >
              <option value="">All</option>
              {languages.map((language) => (
                <option value={language} key={language}>
                  {language}
                </option>
              ))}
            </Form.Select>
          </div>
        </label>
      </div>
      <div className={styles['label-and-input-div']}>
        <label htmlFor="searchYear">
          Year
          <div className={styles['inter-control-spacing']}>
            <NumberRangeInput
              name="searchYear"
              disabled={searchType !== MovieType.Movie}
              classNameCustom={styles['input-style-search-year-genre']}
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
          <div className={styles['inter-control-spacing']}>
            <input
              disabled
              type="text"
              name="searchGenres"
              value={searchGenres.join(', ')}
              className={`${styles['input-style-search-year-genre']} ${styles['input-style-form-control']}`}
            />
            <Button
              onClick={onGenresClicked}
              variant="primary"
              className={styles['genre-button']}
            >
              ...
            </Button>
          </div>
        </label>
      </div>
    </>
  );
};

export default SearchControls;
