import React from 'react';
import PropTypes from 'prop-types';

import * as styles from './Movie.css';

interface IProps {
  title: string;
  year: string;
  body: string;
  clicked: () => void;
}

const Movie: React.FC<IProps> = (props) => {
  const { title, year, body, clicked} = props;

  return (
    <div className={styles.Movie} onClick={clicked} onKeyDown={clicked} role="button" tabIndex={0}>
      <h1>{title}</h1>
      <div>
        {year}
        <div>
          <small className={styles.Author}>{body}</small>
        </div>
      </div>
    </div>
  );
};

Movie.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  clicked: PropTypes.func.isRequired
};

export default Movie;