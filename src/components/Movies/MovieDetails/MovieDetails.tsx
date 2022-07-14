import React, {
  useState,
  useEffect,
  ReactElement,
  useRef,
  useCallback,
} from 'react';

import axios from '../../../axios';
import styles from './movieDetails.module.scss';
import globStyles from '../../../index.module.scss';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';
import { TextConstants } from '../../../constants/TextConstants';
import { getMovieDetails } from '../../../utils/MovieUtil';
import IMovieSearch from '../../../interfaces/IMovieSearch';
import Spinner from '../../UI/Spinner/Spinner';
import { SEARCH_URL } from '../../../constants/Constants';
import MovieDetailsInput from './MovieDetailsInput/MovieDetailsInput';
import { isValidUrl } from '../../../utils/UrlUtil';
import { getSettingValue } from '../../../state/settings';
import AlertConfirmation from '../../UI/AlertConfirmation/AlertConfirmation';
import { isErrorResponse } from '../../../types/ErrorResponse';

interface IProps {
  selectedMovieIMDBId: string;
  removeMovie?: (imdbIDToRemove: string) => void;
}

const MovieDetails: React.FC<IProps> = (props: IProps) => {
  const { selectedMovieIMDBId, removeMovie } = props;
  const [movieTotalInitial, setMovieTotalInitial] = useState(0);
  const [movieLoading, setMovieLoading] = useState(false);
  const [movError, setMovError] = useState('');
  const [movID, setMovID] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<
    IMovieSearch | undefined
  >();
  const [languagesInitial, setLanguagesInitial] = useState<string[]>([]);
  const apiKeySetting = getSettingValue('apiKey');
  const languagesSetting = getSettingValue('languages');
  const languages = (languagesSetting && languagesSetting.split(',')) || [];
  const prevSelIMDBId = useRef('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        setMovError('');
        setMovieTotalInitial(movieTotal);
        setLanguagesInitial(selectedLanguages);
        setMovieLoading(false);
        return true;
      } catch (error) {
        setMovError(`${TextConstants.MOVIESAVEERRORLIB}: ${error}`);
        setMovieLoading(false);
      }
    }
    return false;
  };

  const deleteMovie = async (): Promise<void> => {
    setMovError('');
    setMovieLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_NODE_SERVER}/movies`, {
        params: { idArray: [movID] },
      });
      setShowDeleteConfirm(false);
      removeMovie && removeMovie(selectedMovieIMDBId);
    } catch (err) {
      if (isErrorResponse(err)) {
        setMovError(
          `${TextConstants.MOVIEDELETEERROR}: ${err.response.data.Error}`
        );
      } else {
        setMovError(TextConstants.MOVIEDELETEERROR);
      }
      setShowDeleteConfirm(false);
    } finally {
      setMovieLoading(false);
    }
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
          setMovError('');
        }
      } catch (error) {
        setMovError(`${TextConstants.MOVIELOADERRORLIB}: ${error}`);
      }
    }

    if (selectedMovieIMDBId && prevSelIMDBId.current !== selectedMovieIMDBId) {
      prevSelIMDBId.current = selectedMovieIMDBId;
      fetchData();
    }
  }, [apiKeySetting, retrieveLanguagesFromOMDB, selectedMovieIMDBId]);

  const onDeleteClicked = (): void => {
    setShowDeleteConfirm(true);
  };

  const onCancelledDelete = (): void => {
    setShowDeleteConfirm(false);
  };

  const renderConfirmModal = (): ReactElement => {
    return (
      <AlertConfirmation
        message="Are you sure you wish to delete these movies?"
        title="Delete"
        oKButtonText="Delete"
        onConfirmed={deleteMovie}
        onCancelled={onCancelledDelete}
      />
    );
  };

  const renderContent = (): ReactElement | null => {
    if (!selectedMovie) {
      return null;
    }

    const image = isValidUrl(selectedMovie.mediaURL) && (
      <img
        src={selectedMovie.mediaURL}
        alt={selectedMovie.title}
        height={300}
      />
    );

    return (
      <div className={styles.container}>
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
            onDeleteClicked={onDeleteClicked}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {!movError && renderContent()}
      {movError && <p className={globStyles['error-text']}>{movError}</p>}
      {showDeleteConfirm && renderConfirmModal()}
    </>
  );
};

export default MovieDetails;
