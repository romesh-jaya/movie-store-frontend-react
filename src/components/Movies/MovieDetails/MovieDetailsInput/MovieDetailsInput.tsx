/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect, useContext, ReactNode, useCallback, useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import * as styles from './MovieDetailsInput.css';
import * as globStyles from '../../../../index.css';
import SettingsContext from '../../../../context/SettingsContext';
import { ICheckboxValue } from '../../../../interfaces/ICheckboxValue';

interface IProps {
  languagesInitial: string[];
  movieTotalInitial: number;
  onSaveClicked: (selectedLanguages: string[], movieTotal: number) => Promise<boolean>;
}

const MovieDetailsInput: React.FC<IProps> = (props: IProps) => {
  const { languagesInitial, movieTotalInitial, onSaveClicked } = props;
  const [movieTotal, setMovieTotal] = useState(0);
  const [movieValuesChanged, setMovieValuesChanged] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState<ICheckboxValue[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const settings = useContext(SettingsContext);
  const languagesSetting = settings.find(setting => setting.name === 'languages');
  const languages = languagesSetting && languagesSetting.value.split(',') || [];
  const prevLanguagesInitial = useRef('');
  const prevMovieValuesChanged = useRef(false);

  const onReset = (): void => {
    setMovieValuesChanged(false);
    setMovieTotal(movieTotalInitial);
  };

  const onAddClicked = (): void => {
    setMovieTotal(prevTotal => prevTotal + 1);
    setMovieValuesChanged(true);
  };

  const onRemoveClicked = (): void => {
    setMovieTotal(prevTotal => prevTotal - 1);
    setMovieValuesChanged(true);
  };

  const setCheckboxLanguage = (language: string, checked: boolean): void => {
    setCheckboxValues(prevVal => {
      const tempArray = prevVal.filter(prevCheckbox => (prevCheckbox.name !== `is${language}`));
      return tempArray.concat([{ name: `is${language}`, checked }]);
    });
  };

  const initLanguageCheckboxes = useCallback((): void => {
    setSelectedLanguages(languagesInitial);
    languages.forEach(language => {
      if (languagesInitial.includes(language)) {
        setCheckboxLanguage(language, true);
      } else {
        setCheckboxLanguage(language, false);
      }
    });
  }, [languages, languagesInitial]);

  useEffect(() => {
    // call the init function when languagesInitial changes or Reset button is pressed
    if ((prevLanguagesInitial.current !== JSON.stringify(languagesInitial)) || 
    (!movieValuesChanged && prevMovieValuesChanged.current !== movieValuesChanged)) {
      prevLanguagesInitial.current = JSON.stringify(languagesInitial);
      initLanguageCheckboxes();
    }

    if (prevMovieValuesChanged.current !== movieValuesChanged)     {
      prevMovieValuesChanged.current = movieValuesChanged;
    }
  }, [initLanguageCheckboxes, languagesInitial, movieValuesChanged]);


  useEffect(() => {
    setMovieTotal(movieTotalInitial);
  }, [movieTotalInitial]);

  const onLanguageChecked = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    const checkboxName = event.target.name;

    setMovieValuesChanged(true);
    languages.forEach(language => {
      if (checkboxName === (`is${language}`)) {
        if (checked) {
          setSelectedLanguages(prevGenres => {
            return prevGenres.concat([language]);
          });
          setCheckboxLanguage(language, true);
        } else {
          setSelectedLanguages(prevGenres => {
            return prevGenres.filter(prevGenre => (prevGenre !== language));
          });
          setCheckboxLanguage(language, false);
        }
      }
    });
  };

  const getCheckboxValue = (language: string): boolean => {
    const retVal = checkboxValues.find(checkbox => (checkbox.name === `is${language}`))?.checked;
    return retVal || false;
  };

  const onSaveClickedInternal = async (): Promise<void> => {
    const retVal = await onSaveClicked(selectedLanguages, movieTotal);
    if (retVal) {
      setMovieValuesChanged(false);
    }
  };

  const renderLanguages = (): ReactNode => {
    return (
      <div className={globStyles['margin-b-20']}>
        <div className={globStyles['margin-b-10']}>
          Set Movie Languages:
        </div>
        <div className={styles['language-container']}>
          {
            languages.map(language => {
              return (
                <FormControlLabel
                  key={`label${language}`}
                  control={
                    (
                      <Checkbox
                        checked={getCheckboxValue(language)}
                        onChange={onLanguageChecked}
                        name={`is${language}`}
                        color="primary"
                      />
                  )
                  }
                  label={language}
                />
              );
            })
          }
        </div>
      </div>
    );
  };

  return (
    <>
      {renderLanguages()}
      <div className={globStyles['margin-b-20']}>
        <span className={globStyles['margin-r-10']}>
          <Button variant="contained" color="primary" onClick={onAddClicked}>
            +1 to library
          </Button>
        </span>
        <Button variant="contained" color="secondary" onClick={onRemoveClicked} disabled={movieTotal < 2}>
          -1 from library
        </Button>
      </div>
      <div className={globStyles['margin-b-20']}>
        <span className={globStyles['margin-r-30']}>
          <TextField
            id="outlined-basic"
            label="Total Count"
            InputProps={
            {
              readOnly: true
            }
            }
            inputProps={
            {
              style: { textAlign: 'right', width: '90px' }
            }
            }
            value={movieTotal}
            type="number"
          />
        </span>          
        <span className={styles['first-button']}>
          <Button onClick={onReset} color="primary" variant="contained">
            Reset
          </Button>
        </span>
        <Button variant="contained" color="secondary" onClick={onSaveClickedInternal} disabled={!movieValuesChanged}>
          Save
        </Button>
      </div>
    </>
  );

};


export default MovieDetailsInput;