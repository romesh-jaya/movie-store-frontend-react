import React, { useContext, useState, useEffect, useRef } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import KeyContext from '../../context/KeyContext';
import axios from '../../axios';

interface IProps {
  setAPIKey: (apiKey: string) => void
}

const Settings: React.FC<IProps> = (props: IProps) => {
  const apiKey = useContext(KeyContext);
  const [omdbAPIKeyEntered, SetOmdbAPIKeyEntered] = useState('');
  const [settingsChanged, SetSettingsChanged] = useState(false);
  const { setAPIKey } = props;
  const isMountedRef = useRef(false);

  const omdbAPIKeyEnteredOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    SetOmdbAPIKeyEntered(event.target.value.trim());
    SetSettingsChanged(true);
  };

  const onSaveClicked = (): void => {
    // this var is to avoid the warning 'can't perform a react state update on an unmounted component.'

    axios.patch(`${process.env.REACT_APP_NODE_SERVER}/settings`,
      {
        name: 'apiKey',
        value: omdbAPIKeyEntered
      })
      .then(() => {
        setAPIKey(omdbAPIKeyEntered);
        if (isMountedRef.current) {
          SetSettingsChanged(false);
        }
      });
  };

  // load the settings
  useEffect(() => {
    isMountedRef.current = true;
    SetOmdbAPIKeyEntered(apiKey);

    return () => {
      isMountedRef.current = false;
    };
  }, [apiKey]);

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
    </>
  );
};

export default Settings;