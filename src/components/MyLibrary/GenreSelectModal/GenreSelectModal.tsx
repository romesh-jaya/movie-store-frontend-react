import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/esm/Offcanvas';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';

import styles from './genreSelectModal.module.scss';
import { Genres, IGenre } from '../../../constants/Genres';
import { ICheckboxValue } from '../../../interfaces/ICheckboxValue';

interface IProps {
  initialGenres: string[];
  onConfirmed: (genres: string[]) => void;
  onCancelled: () => void;
}

const GenreSelectModal: React.FC<IProps> = (props) => {
  const { initialGenres, onConfirmed, onCancelled } = props;
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [checkboxValues, setCheckboxValues] = useState<ICheckboxValue[]>([]);

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

  const onGenreChecked = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const checkboxName = event.target.name;
    const checked = event.target.checked;

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
    return (
      <Form className={`my-4 ${styles['genre-container']}`}>
        {Genres.map((genre) => {
          return (
            <Form.Check
              type="checkbox"
              key={`label${genre.id}`}
              label={genre.genre}
              checked={
                checkboxValues.find(
                  (checkbox) => checkbox.name === `is${genre.id}`
                )?.checked
              }
              onChange={onGenreChecked}
              name={`is${genre.id}`}
            />
          );
        })}
      </Form>
    );
  };

  const renderActions = () => {
    return (
      <div className={styles['buttons']}>
        <Button onClick={onReset} variant="primary">
          Reset
        </Button>
        <Button onClick={onCancelled} variant="secondary">
          Cancel
        </Button>
        <Button onClick={() => onConfirmed(selectedGenres)} variant="secondary">
          OK
        </Button>
      </div>
    );
  };

  return (
    <>
      <Offcanvas show onHide={onCancelled}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Select Genres</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.body}>
          {renderGenres()}
          {renderActions()}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default GenreSelectModal;
