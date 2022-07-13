import React from 'react';

import styles from './movieTable.module.scss';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';
import Accordion from 'react-bootstrap/esm/Accordion';
import MovieDetails from '../../Movies/MovieDetails/MovieDetails';
import Pagination from 'react-bootstrap/esm/Pagination';

interface IProps {
  lastSearchMovieCount: number;
  currentPage: number;
  pageSize: number;
  movies: IMovieLibrary[];
  onDeleteClicked: (data: IMovieLibrary | IMovieLibrary[]) => void;
  handleClickTitle: (imdbID: string) => void;
  handleChangePage: (page: number) => void;
}

const MovieTable: React.FC<IProps> = (props: IProps) => {
  const {
    lastSearchMovieCount,
    currentPage,
    movies,
    handleChangePage,
    pageSize,
  } = props;
  const noOfPages = Math.ceil(lastSearchMovieCount / pageSize);

  return (
    <div className={`mt-2 ${styles['table-style']}`}>
      <Accordion>
        {movies.map((movie) => (
          <Accordion.Item eventKey={movie.imdbID} key={movie.imdbID}>
            <Accordion.Header>{movie.title}</Accordion.Header>
            <Accordion.Body>
              <MovieDetails selectedMovieIMDBId={movie.imdbID}></MovieDetails>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <div className={`mt-2 ${styles['pagination-style']}`}>
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
