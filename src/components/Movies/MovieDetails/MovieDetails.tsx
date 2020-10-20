import React, { useState, useEffect, useContext, ReactNode, useRef, useCallback } from 'react';
import { Drawer } from '@material-ui/core';

import axios from '../../../axios';
import * as styles from './MovieDetails.css';
import * as globStyles from '../../../index.css';
import { MovieType } from '../../../enums/MovieType';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';
import { TextConstants } from '../../../constants/TextConstants';
import { getMovieDetails } from '../../../utils/MovieUtil';
import SettingsContext from '../../../context/SettingsContext';
import IMovieSearch from '../../../interfaces/IMovieSearch';
import Spinner from '../../UI/Spinner/Spinner';
import { SEARCH_URL } from '../../../constants/Constants';
import MovieDetailsInput from './MovieDetailsInput/MovieDetailsInput';

interface IProps {
  selectedMovieIMDBId: string;
  openDrawerValue: boolean;
  openDrawer: () => void;
}

const MovieDetails: React.FC<IProps> = (props: IProps) => {
  const { selectedMovieIMDBId, openDrawer, openDrawerValue } = props;
  const [movieTotalInitial, setMovieTotalInitial] = useState(0);
  const [movieLoading, setMovieLoading] = useState(false);
  const [movError, SetMovError] = useState('');
  const [movID, setMovID] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<IMovieSearch | undefined>();
  const [languagesInitial, setLanguagesInitial] = useState<string[]>([]);
  const settings = useContext(SettingsContext);
  const apiKeySetting = settings.find(setting => setting.name === 'apiKey');
  const apiKey = apiKeySetting && apiKeySetting.value || '';
  const languagesSetting = settings.find(setting => setting.name === 'languages');
  const languages = languagesSetting && languagesSetting.value.split(',') || [];
  const prevSelIMDBId = useRef('');

  const handleDrawerToggle = (): void => {
    openDrawer();
  };

  const handleDrawerToggleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift' || (event as React.KeyboardEvent).key === 'Control')
    ) {
      return;
    }
    openDrawer();
  };

  const retrieveLanguagesFromOMDB = useCallback((movie: IMovieSearch): string[] => {
    const retVal : string[] = [];

    languages.forEach(language => {
      if (movie.languages.includes(language)) {
        retVal.push(language);
      }
    });
    return retVal;
  }, [languages]);

  const onSaveClicked = async (selectedLanguages: string[], movieTotal: number): Promise<boolean> => {
    if (selectedMovie) {
      try {
        setMovieLoading(true);
        if (!movID) {
          const movieDetails : IMovieLibrary = 
          {
            imdbID: selectedMovie.imdbID,
            count: movieTotal,
            title: selectedMovie.title,
            year: selectedMovie.year,
            type: selectedMovie.type,
            pGRating: selectedMovie.pGRating,
            languages: selectedLanguages,
            genre: selectedMovie.genre
          };

          const response = await axios.post(`${process.env.REACT_APP_NODE_SERVER}/movies`,
            movieDetails);
          setMovID(response.data.id);
        } else {
          await axios.patch(`${process.env.REACT_APP_NODE_SERVER}/movies`,
            {
              id: movID,
              count: movieTotal,
              languages: selectedLanguages
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
    async function fetchData() : Promise<void> {
      setMovieLoading(true);

      try {
        const movie = await getMovieDetails(selectedMovieIMDBId, SEARCH_URL, apiKey);
        setSelectedMovie(movie);
        const response = await axios.get(`${process.env.REACT_APP_NODE_SERVER}/movies/imdbid/${selectedMovieIMDBId}`);
        if (response) {
          setMovieTotalInitial(response.data.count);
          setLanguagesInitial(response.data.languages.length? response.data.languages : retrieveLanguagesFromOMDB(movie));
          setMovID(response.data.id);
          SetMovError('');
          setMovieLoading(false);
        } 
      } catch (error) {
        SetMovError(`${TextConstants.MOVIELOADERRORLIB}: ${error}`);
        setMovieLoading(false);
      }
    }

    if (selectedMovieIMDBId && (prevSelIMDBId.current !== selectedMovieIMDBId)) {
      prevSelIMDBId.current = selectedMovieIMDBId;
      fetchData();
    }
  }, [apiKey, retrieveLanguagesFromOMDB, selectedMovieIMDBId]);

  const isValidUrl = (toValidate: string | undefined): boolean => {
    try {
      const url = new URL(toValidate || '');
      return !!url;
    } catch (_) {
      return false;
    }
  };

  const renderContent = () : ReactNode | null => {
    if (!selectedMovie) {
      return null;
    }

    const heading = (selectedMovie.type === MovieType.TvSeries) ? '(TV series)' : '(Movie)';
    const image = isValidUrl(selectedMovie.mediaURL) ? <img src={selectedMovie.mediaURL} alt={selectedMovie.title} /> : null;  

    let borderBoxStyle = movieTotalInitial? styles['movie-present'] : styles['movie-absent'];
    borderBoxStyle += ` ${styles['movie-details']}`;

    return (
      <div className={borderBoxStyle}>
        <div className={globStyles['margin-b-20']}>
          <div className={globStyles['margin-b-20']}>
            <h3 className={styles['header-custom']}>
              <span className={styles['header-custom-span']}>
                {selectedMovie.title}
                {' '}
                {heading}
                {' '}
              </span>
            </h3>
            <p>{selectedMovie.year}</p>
            <p>{selectedMovie.actors}</p>
            <small>{selectedMovie.plot}</small>
          </div>
          {image}
        </div>
        {
          movieLoading? (
            <div className={styles['spinner-div']}>
              <Spinner />
            </div>
          ) : null
        }
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
    );
  };

  return (
    <Drawer
      anchor="right"
      open={openDrawerValue}
      onClose={handleDrawerToggle}
      onKeyDown={handleDrawerToggleKeyDown}
      classes={
      {
        paper: styles.drawer,
      }
      }
    >
      <div>
        {!movError && renderContent()}
        {movError ? <p className={globStyles['error-text']}>{movError}</p> : null}
      </div>
    </Drawer>
  );
};


export default MovieDetails;