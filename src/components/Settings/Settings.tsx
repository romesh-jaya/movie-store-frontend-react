import React, { useContext, useState, useEffect, useRef, ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import * as globStyles from '../../index.css';
import KeyContext from '../../context/KeyContext';
import axios from '../../axios';
import { TextConstants } from '../../constants/TextConstants';

interface IProps {
  setAPIKey: (apiKey: string) => void
}

const Settings: React.FC<IProps> = (props: IProps) => {
  const apiKey = useContext(KeyContext);
  const [settingsError, setSettingsError] = useState('');
  const [omdbAPIKeyEntered, SetOmdbAPIKeyEntered] = useState('');
  const [settingsChanged, SetSettingsChanged] = useState(false);
  const { setAPIKey } = props;
  const isMountedRef = useRef(false);

  const omdbAPIKeyEnteredOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    SetOmdbAPIKeyEntered(event.target.value.trim());
    SetSettingsChanged(true);
  };

  const onSaveClicked = async (): Promise<void> => {
    try {
      await axios.patch(`${process.env.REACT_APP_NODE_SERVER}/settings`,
        {
          name: 'apiKey',
          value: omdbAPIKeyEntered
        });
      setAPIKey(omdbAPIKeyEntered);
      // this var is to avoid the warning 'can't perform a react state update on an unmounted component.'
      if (isMountedRef.current) {
        SetSettingsChanged(false);
        setSettingsError('');
      }
    } catch (error) {
      setSettingsError(`${TextConstants.MOVIESAVESETTINGS}: ${error}`);
    }
  };

  // load the settings
  useEffect(() => {
    isMountedRef.current = true;
    SetOmdbAPIKeyEntered(apiKey);

    return () => {
      isMountedRef.current = false;
    };
  }, [apiKey]);

  const renderError = (): ReactNode | null => {
    return settingsError ? (
      <p className={globStyles['error-text']}>
        {settingsError}
      </p>
    ) : null;
  };

  return (
    <>
      <h2>
        Settings
      </h2>
      <form>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="apiKey"
          label="OMDB API Key"
          name="apiKey"
          value={omdbAPIKeyEntered}
          onChange={omdbAPIKeyEnteredOnChange}
          autoFocus
        />
      </form>
      <Button variant="outlined" color="primary" onClick={onSaveClicked} disabled={!settingsChanged}>
        Save
      </Button>
      {renderError()}
    </>
  );
};

export default Settings;