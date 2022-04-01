import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useMediaQuery } from '@material-ui/core';
import styles from './genreSelectModal.module.css';
import { Genres, IGenre } from '../../../constants/Genres';
import { ICheckboxValue } from '../../../interfaces/ICheckboxValue';
import { DESKTOP_WIDTH_MEDIA_QUERY } from '../../../constants/Constants';

interface IProps {
  initialGenres: string[];
  onConfirmed: (genres: string[]) => void;
  onCancelled: () => void;
}

const GenreSelectModal: React.FC<IProps> = (props) => {
  const { initialGenres, onConfirmed, onCancelled } = props;
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [checkboxValues, setCheckboxValues] = useState<ICheckboxValue[]>([]);
  const isDesktopWidth = useMediaQuery(DESKTOP_WIDTH_MEDIA_QUERY);

  const initForm = useCallback((): void => {
    setSelectedGenres(initialGenres);
    Genres.forEach((genre) => {
      if (initialGenres.includes(genre.genre)) {
        setCheckboxValues((prevVal) => {
          return prevVal.concat([{ name: `is${genre.id}`, checked: true }]);
        });
      } else {
        setCheckboxValues((prevVal) => {
          return prevVal.concat([{ name: `is${genre.id}`, checked: false }]);
        });
      }
    });
  }, [initialGenres]);

  useEffect(() => {
    initForm();
  }, [initForm]);

  const setCheckboxGenre = (genre: IGenre, checked: boolean): void => {
    setCheckboxValues((prevVal) => {
      const tempArray = prevVal.filter(
        (prevCheckbox) => prevCheckbox.name !== `is${genre.id}`
      );
      return tempArray.concat([{ name: `is${genre.id}`, checked }]);
    });
  };

  const onReset = (): void => {
    setSelectedGenres([]);
    Genres.forEach((genre) => {
      setCheckboxGenre(genre, false);
    });
  };

  const onGenreChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    const checkboxName = event.target.name;

    Genres.forEach((genre) => {
      if (checkboxName === `is${genre.id}`) {
        if (checked) {
          setSelectedGenres((prevGenres) => {
            return prevGenres.concat([genre.genre]);
          });
          setCheckboxGenre(genre, true);
        } else {
          setSelectedGenres((prevGenres) => {
            return prevGenres.filter((prevGenre) => prevGenre !== genre.genre);
          });
          setCheckboxGenre(genre, false);
        }
      }
    });
  };

  const renderGenres = (): ReactElement => {
    const contClass = isDesktopWidth
      ? styles['genre-container-3']
      : styles['genre-container-2'];
    return (
      <div className={contClass}>
        {Genres.map((genre) => {
          return (
            <FormControlLabel
              key={`label${genre.id}`}
              control={
                <Checkbox
                  checked={
                    checkboxValues.find(
                      (checkbox) => checkbox.name === `is${genre.id}`
                    )?.checked
                  }
                  onChange={onGenreChecked}
                  name={`is${genre.id}`}
                  color="primary"
                />
              }
              label={genre.genre}
            />
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open onClose={onCancelled}>
      <DialogTitle>
        <div className={styles.header}>
          <div className={styles.title}>Select Genres</div>
          <div className={styles['close-button']}>
            <Button onClick={onCancelled}>
              <ClearIcon />
            </Button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>{renderGenres()}</DialogContent>
      <DialogActions>
        <span className={styles['first-button']}>
          <Button onClick={onReset} color="primary" variant="contained">
            Reset
          </Button>
        </span>
        <span className={styles['first-button']}>
          <Button onClick={onCancelled} color="primary" variant="contained">
            Cancel
          </Button>
        </span>
        <Button
          onClick={() => onConfirmed(selectedGenres)}
          autoFocus
          color="secondary"
          variant="contained"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenreSelectModal;
