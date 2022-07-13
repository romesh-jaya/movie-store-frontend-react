import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import TablePagination from '@mui/material/TablePagination';

import styles from './movieTable.module.scss';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';
import { DESKTOP_WIDTH_MEDIA_QUERY } from '../../../constants/Constants';
import Accordion from 'react-bootstrap/esm/Accordion';
import MovieDetails from '../../Movies/MovieDetails/MovieDetails';

interface IProps {
  lastSearchMovieCount: number;
  currentPage: number;
  pageSize: number;
  movies: IMovieLibrary[];
  onDeleteClicked: (data: IMovieLibrary | IMovieLibrary[]) => void;
  handleClickTitle: (imdbID: string) => void;
  handleChangePage: (
    _: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  handleChangeRowsPerPage: (pageSizeVal: number) => void;
}

const MovieTable: React.FC<IProps> = (props: IProps) => {
  const {
    lastSearchMovieCount,
    currentPage,
    pageSize,
    movies,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;
  const isDesktopWidth = useMediaQuery(DESKTOP_WIDTH_MEDIA_QUERY);

  return (
    <div className={styles['table-style']}>
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
      <div className={styles['pagination-style']}>
        <TablePagination
          component="div"
          count={lastSearchMovieCount ?? 0}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => handleChangeRowsPerPage(parseInt(event.target.value, 10))}
          rowsPerPageOptions={isDesktopWidth ? [10, 25, 50] : []}
        />
      </div>
    </div>
  );
};

export default MovieTable;
