import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import styles from './settings.module.css';
import globStyles from '../../index.module.scss';
import axios from '../../axios';
import { TextConstants } from '../../constants/TextConstants';
import Spinner from '../UI/Spinner/Spinner';
import INameValue from '../../interfaces/INameValue';
import { getSettingValue, initSettings } from '../../state/settings';

const Settings: React.FC = () => {
  const [settingsError, setSettingsError] = useState('');
  const [languagesEnteredError, setLanguagesEnteredError] = useState('');
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(false);
  const apiKeySetting = getSettingValue('apiKey');
  const languagesSetting = getSettingValue('languages');
  const [languagesEntered, setLanguagesEntered] = useState(languagesSetting);
  const [omdbAPIKeyEntered, setOmdbAPIKeyEntered] = useState(apiKeySetting);

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
      initSettings(dataSave);
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
