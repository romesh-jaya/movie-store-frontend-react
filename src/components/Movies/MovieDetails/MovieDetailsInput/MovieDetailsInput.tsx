/* eslint-disable react/jsx-no-duplicate-props */
import React, {
  useState,
  useEffect,
  ReactElement,
  useCallback,
  useRef,
} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSnackbar } from 'notistack';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useAuth0 } from '@auth0/auth0-react';
import styles from './movieDetailsInput.module.css';
import globStyles from '../../../../index.module.scss';
import { ICheckboxValue } from '../../../../interfaces/ICheckboxValue';
import { TextConstants } from '../../../../constants/TextConstants';
import { isAdmin } from '../../../../utils/AuthUtil';
import { addItem, removeItem, cartItems } from '../../../../state/cart';
import { getSettingValue } from '../../../../state/settings';
import { PREFERS_DARK_MODE_MEDIA_QUERY } from '../../../../constants/Constants';

interface IProps {
  languagesInitial: string[];
  movieTotalInitial: number;
  imdbID: string;
  title: string;
  onSaveClicked: (
    selectedLanguages: string[],
    movieTotal: number
  ) => Promise<boolean>;
  onDeleteClicked: () => void;
}

const MovieDetailsInput: React.FC<IProps> = (props: IProps) => {
  const {
    languagesInitial,
    movieTotalInitial,
    imdbID,
    title,
    onSaveClicked,
    onDeleteClicked,
  } = props;
  const [movieTotal, setMovieTotal] = useState(0);
  const [movieValuesChanged, setMovieValuesChanged] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState<ICheckboxValue[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [errorTextLanguages, setErrorTextLanguages] = useState('');
  const languagesSetting = getSettingValue('languages');
  const languages = (languagesSetting && languagesSetting.split(',')) || [];
  const prevLanguagesInitial = useRef('');
  const prevMovieValuesChanged = useRef(false);
  const { user } = useAuth0();
  const cartItemsArray = cartItems.use();
  const { enqueueSnackbar } = useSnackbar();
  const prefersDarkMode = useMediaQuery(PREFERS_DARK_MODE_MEDIA_QUERY);

  const itemExists = (imdbID: string): boolean => {
    return !!cartItemsArray.find((itemOne) => itemOne.imdbID === imdbID);
  };

  const onReset = (): void => {
    setMovieValuesChanged(false);
    setMovieTotal(movieTotalInitial);
  };

  const onAddClicked = (): void => {
    setMovieTotal((prevTotal) => prevTotal + 1);
    setMovieValuesChanged(true);
  };

  const onRemoveClicked = (): void => {
    setMovieTotal((prevTotal) => prevTotal - 1);
    setMovieValuesChanged(true);
  };

  const setCheckboxLanguage = (language: string, checked: boolean): void => {
    setCheckboxValues((prevVal) => {
      const tempArray = prevVal.filter(
        (prevCheckbox) => prevCheckbox.name !== `is${language}`
      );
      return tempArray.concat([{ name: `is${language}`, checked }]);
    });
  };

  const initLanguageCheckboxes = useCallback((): void => {
    setSelectedLanguages(languagesInitial);
    languages.forEach((language) => {
      if (languagesInitial.includes(language)) {
        setCheckboxLanguage(language, true);
      } else {
        setCheckboxLanguage(language, false);
      }
    });
  }, [languages, languagesInitial]);

  useEffect(() => {
    // call the init function when languagesInitial changes or Reset button is pressed
    if (
      prevLanguagesInitial.current !== JSON.stringify(languagesInitial) ||
      (!movieValuesChanged &&
        prevMovieValuesChanged.current !== movieValuesChanged)
    ) {
      prevLanguagesInitial.current = JSON.stringify(languagesInitial);
      initLanguageCheckboxes();
    }

    if (prevMovieValuesChanged.current !== movieValuesChanged) {
      prevMovieValuesChanged.current = movieValuesChanged;
    }
  }, [initLanguageCheckboxes, languagesInitial, movieValuesChanged]);

  useEffect(() => {
    setMovieTotal(movieTotalInitial);
  }, [movieTotalInitial]);

  const onLanguageChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    const checkboxName = event.target.name;

    setErrorTextLanguages('');
    setMovieValuesChanged(true);
    languages.forEach((language) => {
      if (checkboxName === `is${language}`) {
        if (checked) {
          setSelectedLanguages((prevGenres) => {
            return prevGenres.concat([language]);
          });
          setCheckboxLanguage(language, true);
        } else {
          setSelectedLanguages((prevGenres) => {
            return prevGenres.filter((prevGenre) => prevGenre !== language);
          });
          setCheckboxLanguage(language, false);
        }
      }
    });
  };

  const getCheckboxValue = (language: string): boolean => {
    const retVal = checkboxValues.find(
      (checkbox) => checkbox.name === `is${language}`
    )?.checked;
    return retVal || false;
  };

  const onSaveClickedInternal = async (): Promise<void> => {
    if (!selectedLanguages.length) {
      setErrorTextLanguages(TextConstants.NOLANGSELECT);
      return;
    }

    const retVal = await onSaveClicked(selectedLanguages, movieTotal);
    if (retVal) {
      setMovieValuesChanged(false);
    }
  };

  const onAddRemoveFromCart = (isAdd: boolean) => {
    if (isAdd) {
      addItem({ title, imdbID, id: imdbID });
      enqueueSnackbar('Title added to cart', { variant: 'success' });
    } else {
      removeItem(imdbID);
      enqueueSnackbar('Title removed from cart');
    }
  };

  const renderLanguages = (): ReactElement => {
    return (
      <div className={globStyles['margin-b-20']}>
        <div className={globStyles['margin-b-10']}>Movie Languages:</div>
        <div className={styles['language-container']}>
          {languages.map((language) => {
            return (
              <FormControlLabel
                key={`label${language}`}
                control={
                  <Checkbox
                    disabled={!isAdmin(user)}
                    checked={getCheckboxValue(language)}
                    onChange={onLanguageChecked}
                    name={`is${language}`}
                    color="primary"
                  />
                }
                label={language}
              />
            );
          })}
        </div>
        <div className={globStyles['error-text-small']}>
          <small>{errorTextLanguages}</small>
        </div>
      </div>
    );
  };

  const renderNonLanguages = (): ReactElement | null => {
    return (
      <>
        {isAdmin(user) && (
          <>
            <div className={globStyles['margin-b-20']}>
              <span className={globStyles['margin-r-10']}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onAddClicked}
                >
                  +1 to library
                </Button>
              </span>
              <span className={globStyles['margin-r-10']}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={onRemoveClicked}
                  disabled={movieTotal < 2}
                >
                  -1 from library
                </Button>
              </span>
              <Button
                variant="contained"
                color="secondary"
                onClick={onDeleteClicked}
              >
                Delete from library
              </Button>
            </div>
            <div className={globStyles['margin-b-20']}>
              <span className={globStyles['margin-r-30']}>
                <TextField
                  id="outlined-basic"
                  label="Total Count"
                  InputProps={{
                    readOnly: true,
                  }}
                  inputProps={{
                    style: { textAlign: 'right', width: '90px' },
                  }}
                  value={movieTotal}
                  type="number"
                  variant="standard"
                />
              </span>
              <span className={styles['first-button']}>
                <Button onClick={onReset} color="primary" variant="contained">
                  Reset
                </Button>
              </span>
              <Button
                variant="contained"
                color="secondary"
                onClick={onSaveClickedInternal}
                disabled={!(movieValuesChanged && movieTotal)}
              >
                Save
              </Button>
            </div>
          </>
        )}
        <div>
          <a
            href={`https://www.imdb.com/title/${imdbID}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles['imdb-link']}
            style={{
              color: prefersDarkMode ? 'white' : '',
            }}
          >
            View in IMDB
          </a>
          {!isAdmin(user) && (
            <>
              {!itemExists(imdbID) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onAddRemoveFromCart(true)}
                >
                  Add to Cart
                </Button>
              )}
              {itemExists(imdbID) && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => onAddRemoveFromCart(false)}
                >
                  Remove from Cart
                </Button>
              )}
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {renderLanguages()}
      {renderNonLanguages()}
    </>
  );
};

export default MovieDetailsInput;
