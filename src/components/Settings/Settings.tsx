import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';

import styles from './settings.module.scss';
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
    <div className={`my-3 ${styles.container}`}>
      <h2 className={'mb-4'}>Settings</h2>
      <Form className={'mb-4'}>
        <FloatingLabel label="OMDB API Key" key="apiKey" className={'mb-3'}>
          <Form.Control
            value={omdbAPIKeyEntered}
            onChange={omdbAPIKeyEnteredOnChange}
          />
        </FloatingLabel>
        <FloatingLabel
          label="Languages (use comma separated values)"
          key="languages"
        >
          <Form.Control
            value={languagesEntered}
            onChange={languagesEnteredOnChange}
            isInvalid={!!languagesEnteredError}
          />
        </FloatingLabel>
      </Form>
      {isLoading && (
        <div className={styles['spinner-div']}>
          <Spinner />
        </div>
      )}
      <Button
        variant="primary"
        onClick={onSaveClicked}
        disabled={!settingsChanged}
      >
        Save
      </Button>
      {(languagesEnteredError || settingsError) && (
        <p className={globStyles['error-text']}>
          {languagesEnteredError || settingsError}
        </p>
      )}
    </div>
  );
};

export default Settings;
