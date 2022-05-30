import React, {
  useState,
  useEffect,
  ReactElement,
  useRef,
  useCallback,
} from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import axios from '../../../axios';
import styles from './movieDetails.module.scss';
import globStyles from '../../../index.module.scss';
import { MovieType } from '../../../enums/MovieType';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';
import { TextConstants } from '../../../constants/TextConstants';
import { getMovieDetails } from '../../../utils/MovieUtil';
import IMovieSearch from '../../../interfaces/IMovieSearch';
import Spinner from '../../UI/Spinner/Spinner';
import {
  SEARCH_URL,
  PREFERS_DARK_MODE_MEDIA_QUERY,
} from '../../../constants/Constants';
import MovieDetailsInput from './MovieDetailsInput/MovieDetailsInput';
import { isValidUrl } from '../../../utils/UrlUtil';
import { getSettingValue } from '../../../state/settings';
import Paper from '@mui/material/Paper';

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
  const apiKeySetting = getSettingValue('apiKey');
  const languagesSetting = getSettingValue('languages');
  const languages = (languagesSetting && languagesSetting.split(',')) || [];
  const prevSelIMDBId = useRef('');
  const prefersDarkMode = useMediaQuery(PREFERS_DARK_MODE_MEDIA_QUERY);
  const theme = useTheme();

  const handleDrawerClose = (): void => {
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
          apiKeySetting
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
  }, [apiKeySetting, retrieveLanguagesFromOMDB, selectedMovieIMDBId]);

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

    return (
      <div className={styles.container}>
        <Paper className={styles['movie-details']} elevation={2}>
          <h3
            className={styles['header-custom']}
            style={{
              backgroundColor: prefersDarkMode
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
              color: 'white',
            }}
          >
            <div className={styles['header-custom-span']}>
              {selectedMovie.title} {heading}{' '}
            </div>
            <Button
              onClick={closeDrawer}
              variant="contained"
              color="secondary"
              className={styles['close-button']}
            >
              <ClearIcon />
            </Button>
          </h3>
          <div className={styles['content']}>
            <div className={styles['top-half']}>
              <div className={globStyles['margin-b-20']}>
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
              imdbID={selectedMovie.imdbID}
              title={selectedMovie.title}
              handleDrawerClose={handleDrawerClose}
            />
          </div>
        </Paper>
      </div>
    );
  };

  return (
    <Drawer
      anchor="right"
      open
      onClose={handleDrawerClose}
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
