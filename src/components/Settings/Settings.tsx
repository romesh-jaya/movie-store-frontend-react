import React, { useContext, useState, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import * as styles from './settings.module.css';
import * as globStyles from '../../index.module.css';
import SettingsContext from '../../context/SettingsContext';
import axios from '../../axios';
import { TextConstants } from '../../constants/TextConstants';
import Spinner from '../UI/Spinner/Spinner';
import INameValue from '../../interfaces/INameValue';

interface IProps {
  updateContext: (context: INameValue[]) => void;
}

const Settings: React.FC<IProps> = (props: IProps) => {
  const [settingsError, setSettingsError] = useState('');
  const [omdbAPIKeyEntered, setOmdbAPIKeyEntered] = useState('');
  const [languagesEntered, setLanguagesEntered] = useState('');
  const [languagesEnteredError, setLanguagesEnteredError] = useState('');
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateContext } = props;
  const isMountedRef = useRef(false);
  const settings = useContext(SettingsContext);
  const apiKeySetting = settings.find((setting) => setting.name === 'apiKey');

  const omdbAPIKeyEnteredOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setOmdbAPIKeyEntered(event.target.value.trim());
    setSettingsChanged(true);
  };

  const languagesEnteredOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setLanguagesEntered(event.target.value);
    setLanguagesEnteredError('');
    setSettingsChanged(true);
  };

  // This formats user entered input into the Title case, which is the format used by OMDB
  const formatLanguages = (): string[] => {
    const langArray = languagesEntered.split(',');
    const formattedArray: string[] = [];
    langArray.forEach((lang) => {
      const trimmed = lang.trim();
      if (trimmed) {
        const correctedCase =
          trimmed.charAt(0).toUpperCase() + trimmed.substr(1).toLowerCase();
        formattedArray.push(correctedCase);
      }
    });
    return formattedArray;
  };

  const onSaveClicked = async (): Promise<void> => {
    if (!languagesEntered) {
      setLanguagesEnteredError(TextConstants.NOLANGENTERED);
      return;
    }

    const formattedLangArray = formatLanguages();
    if (!formattedLangArray.length) {
      setLanguagesEnteredError(TextConstants.NOLANGENTERED);
      return;
    }

    const dataSave: INameValue[] = [
      {
        name: 'apiKey',
        value: omdbAPIKeyEntered,
      },
      {
        name: 'languages',
        value: formattedLangArray.join(','),
      },
    ];

    try {
      setIsLoading(true);
      await axios.patch(`${import.meta.env.VITE_NODE_SERVER}/settings`, {
        data: dataSave,
      });
      updateContext(dataSave);
      // this var is to avoid the warning 'can't perform a react state update on an unmounted component.'
      if (isMountedRef.current) {
        setSettingsChanged(false);
        setSettingsError('');
      }
    } catch (error) {
      setSettingsError(`${TextConstants.MOVIESAVESETTINGS}: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // load the settings
  useEffect(() => {
    isMountedRef.current = true;
    if (apiKeySetting) {
      setOmdbAPIKeyEntered(apiKeySetting.value);
    }

    async function loadLanguages(): Promise<void> {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_SERVER}/settings/languages`
        );
        if (response.data.value) {
          setLanguagesEntered(response.data.value);
        }
      } catch {
        setSettingsError(TextConstants.CANNOTCONNECTSERVER);
      } finally {
        setIsLoading(false);
      }
    }

    loadLanguages();

    return () => {
      isMountedRef.current = false;
    };
  }, [apiKeySetting]);

  return (
    <>
      <h2>Settings</h2>
      <form className={globStyles['margin-b-20']}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          key="apiKey"
          label="OMDB API Key"
          value={omdbAPIKeyEntered}
          onChange={omdbAPIKeyEnteredOnChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          key="languages"
          label="Languages (use comma separated values)"
          value={languagesEntered}
          onChange={languagesEnteredOnChange}
          error={!!languagesEnteredError}
          helperText={languagesEnteredError}
        />
      </form>
      {isLoading && (
        <div className={styles['spinner-div']}>
          <Spinner />
        </div>
      )}
      <Button
        variant="outlined"
        color="primary"
        onClick={onSaveClicked}
        disabled={!settingsChanged}
      >
        Save
      </Button>
      {settingsError && (
        <p className={globStyles['error-text']}>{settingsError}</p>
      )}
    </>
  );
};

export default Settings;
