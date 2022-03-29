import React from 'react';
import styles from './movie.module.css';

interface IProps {
  title: string;
  year: string;
  body: string;
  clicked: () => void;
}

const Movie: React.FC<IProps> = (props) => {
  const { title, year, body, clicked } = props;

  return (
    <div
      className={styles.movie}
      onClick={clicked}
      onKeyDown={clicked}
      role="button"
      tabIndex={0}
    >
      <h1>{title}</h1>
      <div>
        {year}
        <div>
          <small className={styles.author}>{body}</small>
        </div>
      </div>
    </div>
  );
};

export default Movie;
