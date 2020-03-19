import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import logo from '../../assets/img/movie.png';
import * as styles from './MovieContainer.css';
import MovieSearch from '../../components/Movies/MovieSearch/MovieSearch';

const ZERO = 0;
 
const MovieContainer: React.FC = () => {
  const [value, setValue] = React.useState(ZERO);

  const handleChange = (_ : React.ChangeEvent<{}>, newValue : number) : void => {
    setValue(newValue);
  };

  const TabPanel = (tPanelProps : any) : React.ReactElement => {
    const { children, value: tPanelValue, index} = tPanelProps;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={tPanelValue !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {tPanelValue === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  };
  
  return (
    <>
      <div className={styles.header}>
        <div className={`${styles.nowrapDiv  } ${  styles.div1}`}>
          <img src={logo} height="50px" alt="movies" />
        </div>
        <div className={`${styles.nowrapDiv  } ${  styles.div2} ${  styles.headerText}`}>
            Ultra Movie Shop
        </div>
      </div>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Movie Search - OMDB" id="simple-tab-0" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <MovieSearch />
      </TabPanel>
    </>
  );
};
 
export default MovieContainer;