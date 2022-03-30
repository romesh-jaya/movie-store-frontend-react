import React, {
  useState,
  useEffect,
  useContext,
  ReactElement,
  useRef,
  useCallback,
} from 'react';
import { Button, Drawer } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

import axios from '../../../axios';
import styles from './movieDetails.module.css';
import globStyles from '../../../index.module.css';
import { MovieType } from '../../../enums/MovieType';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';
import { TextConstants } from '../../../constants/TextConstants';
import { getMovieDetails } from '../../../utils/MovieUtil';
import SettingsContext from '../../../context/SettingsContext';
import IMovieSearch from '../../../interfaces/IMovieSearch';
import Spinner from '../../UI/Spinner/Spinner';
import { SEARCH_URL } from '../../../constants/Constants';
import MovieDetailsInput from './MovieDetailsInput/MovieDetailsInput';
import { isValidUrl } from '../../../utils/UrlUtil';

interface IProps {
  selectedMovieIMDBId: string;
  closeDrawer: () => void;
}

const MovieDetails: React.FC<IProps> = (props: IProps) => {
  const { selectedMovieIMDBId, closeDrawer } = props;
  const [movieTotalInitial, setMovieTotalInitial] = useState(0);
  const [movieLoading, setMovieLoading] = useState(false);
  const [movError, SetMovError] = useState('');
  const [movID, setMovID] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<
    IMovieSearch | undefined
  >();
  const [languagesInitial, setLanguagesInitial] = useState<string[]>([]);
  const settings = useContext(SettingsContext);
  const apiKeySetting = settings.find((setting) => setting.name === 'apiKey');
  const apiKey = (apiKeySetting && apiKeySetting.value) || '';
  const languagesSetting = settings.find(
    (setting) => setting.name === 'languages'
  );
  const languages =
    (languagesSetting && languagesSetting.value.split(',')) || [];
  const prevSelIMDBId = useRef('');

  const handleDrawerToggle = (): void => {
    closeDrawer();
  };

  const handleDrawerToggleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ): void => {
    if (
      (event as React.KeyboardEvent).key === 'Tab' ||
      (event as React.KeyboardEvent).key === 'Shift' ||
      (event as React.KeyboardEvent).key === 'Control'
    ) {
      return;
    }
    closeDrawer();
  };

  const retrieveLanguagesFromOMDB = useCallback(
    (movie: IMovieSearch): string[] => {
      const retVal: string[] = [];

      languages.forEach((language) => {
        if (movie.languages.includes(language)) {
          retVal.push(language);
        }
      });
      return retVal;
    },
    [languages]
  );

  const onSaveClicked = async (
    selectedLanguages: string[],
    movieTotal: number
  ): Promise<boolean> => {
    if (selectedMovie) {
      try {
        setMovieLoading(true);
        if (!movID) {
          const movieDetails: IMovieLibrary = {
            imdbID: selectedMovie.imdbID,
            count: movieTotal,
            title: selectedMovie.title,
            year: selectedMovie.year,
            type: selectedMovie.type,
            pGRating: selectedMovie.pGRating,
            languages: selectedLanguages,
            genre: selectedMovie.genre,
          };

          const response = await axios.post(
            `${import.meta.env.VITE_NODE_SERVER}/movies`,
            movieDetails
          );
          setMovID(response.data.id);
        } else {
          await axios.patch(`${import.meta.env.VITE_NODE_SERVER}/movies`, {
            id: movID,
            count: movieTotal,
            languages: selectedLanguages,
          });
        }
        SetMovError('');
        setMovieTotalInitial(movieTotal);
        setLanguagesInitial(selectedLanguages);
        setMovieLoading(false);
        return true;
      } catch (error) {
        SetMovError(`${TextConstants.MOVIESAVEERRORLIB}: ${error}`);
        setMovieLoading(false);
      }
    }
    return false;
  };

  // Perform init actions
  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const movie = await getMovieDetails(
          selectedMovieIMDBId,
          SEARCH_URL,
          apiKey
        );
        setSelectedMovie(movie);
        const response = await axios.get(
          `${
            import.meta.env.VITE_NODE_SERVER
          }/movies/imdbid/${selectedMovieIMDBId}`
        );
        if (response) {
          setMovieTotalInitial(response.data.count);
          setLanguagesInitial(
            response.data.languages.length
              ? response.data.languages
              : retrieveLanguagesFromOMDB(movie)
          );
          setMovID(response.data.id);
          SetMovError('');
        }
      } catch (error) {
        SetMovError(`${TextConstants.MOVIELOADERRORLIB}: ${error}`);
      }
    }

    if (selectedMovieIMDBId && prevSelIMDBId.current !== selectedMovieIMDBId) {
      prevSelIMDBId.current = selectedMovieIMDBId;
      fetchData();
    }
  }, [apiKey, retrieveLanguagesFromOMDB, selectedMovieIMDBId]);

  const renderContent = (): ReactElement | null => {
    if (!selectedMovie) {
      return null;
    }

    const heading =
      selectedMovie.type === MovieType.TvSeries ? '(TV series)' : '(Movie)';
    const image = isValidUrl(selectedMovie.mediaURL) && (
      <img
        src={selectedMovie.mediaURL}
        alt={selectedMovie.title}
        height={300}
      />
    );

    let borderBoxStyle = movieTotalInitial
      ? styles['movie-present']
      : styles['movie-absent'];
    borderBoxStyle += ` ${styles['movie-details']}`;

    return (
      <div className={styles.container}>
        <div className={borderBoxStyle}>
          <div className={styles['top-half']}>
            <div className={globStyles['margin-b-20']}>
              <h3 className={styles['header-custom']}>
                <div className={styles['header-custom-span']}>
                  {selectedMovie.title} {heading}{' '}
                </div>
                <div className={styles['close-button']}>
                  <Button onClick={closeDrawer}>
                    <ClearIcon />
                  </Button>
                </div>
              </h3>
              <p>{selectedMovie.year}</p>
              <p>{selectedMovie.actors}</p>
              <small>{selectedMovie.plot}</small>
            </div>
            <div className={styles['image-container']}>{image}</div>
          </div>
          {movieLoading && (
            <div className={styles['spinner-div']}>
              <Spinner />
            </div>
          )}
          <MovieDetailsInput
            languagesInitial={languagesInitial}
            movieTotalInitial={movieTotalInitial}
            onSaveClicked={onSaveClicked}
          />
          <div>
            <a
              href={`https://www.imdb.com/title/${selectedMovie.imdbID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View in IMDB
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Drawer
      anchor="right"
      open
      onClose={handleDrawerToggle}
      onKeyDown={handleDrawerToggleKeyDown}
      classes={{
        paper: styles.drawer,
      }}
    >
      <>
        {!movError && renderContent()}
        {movError && <p className={globStyles['error-text']}>{movError}</p>}
      </>
    </Drawer>
  );
};

export default MovieDetails;
