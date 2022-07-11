import React, { ReactElement } from 'react';
import { QuestionSquareFill } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Popover from 'react-bootstrap/esm/Popover';

import NumberRangeInput from '../../../Controls/Input/NumberRangeInput/NumberRangeInput';
import styles from '../librarySearchBox.module.scss';
import globStyles from '../../../../index.module.scss';
import { MovieType } from '../../../../enums/MovieType';
import { getSettingValue } from '../../../../state/settings';

interface IProps {
  searchTitle: string;
  searchType: string;
  searchLanguage: string;
  searchYearInput: string;
  searchGenres: string[];
  errorTextSearchYear: string;
  handleChangeSearchTitle: (title: string) => void;
  handleKeyDown: (keyName: string) => void;
  handleChangeSearchType: (searchType: string) => void;
  handleChangeSearchLanguage: (language: string) => void;
  handleChangeSearchYear: (
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
    searchTitle,
    searchType,
    searchLanguage,
    searchYearInput,
    searchGenres,
    errorTextSearchYear,
    handleChangeSearchTitle,
    handleKeyDown,
    handleChangeSearchType,
    handleChangeSearchLanguage,
    handleChangeSearchYear,
    onGenresClicked,
  } = props;
  const languagesSetting = getSettingValue('languages');
  const languages = (languagesSetting && languagesSetting.split(',')) || [];

  const renderHelpYear = (): ReactElement => {
    return (
      <OverlayTrigger
        trigger={['focus', 'hover']}
        placement="bottom"
        overlay={
          <Popover className={`p-2 ${styles.helptext}`}>
            <Popover.Body>
              <div>Value can be entered in the following formats:</div>
              <div>Enter a single year: 2020</div>
              <div>Enter a year to search from: &gt; 2020</div>
              <div>Enter a year to search upto: &lt; 2020</div>
              <div>Enter a range of years: 2010-2020</div>
            </Popover.Body>
          </Popover>
        }
      >
        <Button variant="outline-primary" className={styles['help-button']}>
          <QuestionSquareFill className={styles.helpicon} />
        </Button>
      </OverlayTrigger>
    );
  };

  return (
    <>
      <Form.Group className="fs-5 mb-3">
        <Form.Label htmlFor="searchTitle">Title</Form.Label>
        <Form.Control
          className={`${styles['input-style-search']}`}
          type="text"
          id="searchTitle"
          value={searchTitle}
          onChange={(event) => handleChangeSearchTitle(event.target.value)}
          onKeyDown={(event) => handleKeyDown(event.key)}
        />
      </Form.Group>
      <Form.Group className="fs-5 mb-3">
        <Form.Label htmlFor="searchType">Type</Form.Label>
        <Form.Select
          className={`text-center ${styles['input-style-select']}`}
          value={searchType}
          onChange={(event) =>
            handleChangeSearchType(event.target.value as string)
          }
          id="searchType"
        >
          <option value="">All</option>
          <option value={MovieType.Movie}>Movie</option>
          <option value={MovieType.TvSeries}>TV Series</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="fs-5 mb-3">
        <Form.Label htmlFor="searchLanguage">Language</Form.Label>
        <Form.Select
          className={`text-center ${styles['input-style-select']}`}
          value={searchLanguage}
          onChange={(event) =>
            handleChangeSearchLanguage(event.target.value as string)
          }
          id="searchLanguage"
        >
          <option value="">All</option>
          {languages.map((language) => (
            <option value={language} key={language}>
              {language}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="fs-5 mb-3">
        <Form.Label htmlFor="searchYear">Year</Form.Label>
        <div className={styles['same-line-controls']}>
          <NumberRangeInput
            id="searchYear"
            disabled={searchType === MovieType.TvSeries}
            classNameCustom={styles['input-style-search-year-genre']}
            value={searchYearInput}
            handleReturnValue={handleChangeSearchYear}
          />
          {renderHelpYear()}
        </div>
        <div className={globStyles['error-text-small']}>
          <small>{errorTextSearchYear}</small>
        </div>
      </Form.Group>

      <Form.Group className="fs-5 mb-3">
        <Form.Label htmlFor="searchGenres">Genres</Form.Label>
        <div className={styles['same-line-controls']}>
          <Form.Control
            disabled
            type="text"
            id="searchGenres"
            value={searchGenres.join(', ')}
            className={`text-center ${styles['input-style-search-year-genre']}`}
          />
          <Button
            onClick={onGenresClicked}
            variant="primary"
            className={styles['genre-button']}
          >
            ...
          </Button>
        </div>
      </Form.Group>
    </>
  );
};

export default SearchControls;
