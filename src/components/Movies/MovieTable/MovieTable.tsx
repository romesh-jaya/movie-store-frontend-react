import React from 'react';

import styles from './movieTable.module.scss';
import Accordion from 'react-bootstrap/esm/Accordion';
import MovieDetails from '../MovieDetails/MovieDetails';
import Pagination from 'react-bootstrap/esm/Pagination';
import { MovieTableInfo } from '../../../types/MovieTableInfo';

interface IProps {
  lastSearchMovieCount: number;
  currentPage: number;
  pageSize: number;
  resultsFoundText: string;
  movies: MovieTableInfo[];
  handleChangePage: (page: number) => void;
  removeMovie?: (imdbIDToRemove: string) => void;
}

const MovieTable: React.FC<IProps> = (props: IProps) => {
  const {
    lastSearchMovieCount,
    currentPage,
    movies,
    handleChangePage,
    pageSize,
    removeMovie,
    resultsFoundText,
  } = props;
  const noOfPages = Math.ceil(lastSearchMovieCount / pageSize);

  return (
    <div className={`mt-2 ${styles['table-style']}`}>
      <Accordion>
        {movies.map((movie) => (
          <Accordion.Item eventKey={movie.imdbID} key={movie.imdbID}>
            <Accordion.Header>{movie.title}</Accordion.Header>
            <Accordion.Body>
              <MovieDetails
                selectedMovieIMDBId={movie.imdbID}
                removeMovie={removeMovie}
              ></MovieDetails>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <div className={`mt-3 mb-3 ${styles['pagination-style']}`}>
        <div className="me-3">{resultsFoundText}</div>
        <Pagination>
          <Pagination.First
            disabled={currentPage === 1}
            onClick={() => handleChangePage(1)}
          />
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handleChangePage(currentPage - 1)}
          />
          {Array.from(Array(noOfPages)).map((_, idx) => (
            <Pagination.Item
              key={idx}
              active={currentPage === idx + 1}
              onClick={() => handleChangePage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === noOfPages}
            onClick={() => handleChangePage(currentPage + 1)}
          />
          <Pagination.Last
            disabled={currentPage === noOfPages}
            onClick={() => handleChangePage(noOfPages)}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default MovieTable;
