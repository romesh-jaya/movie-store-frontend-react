import React from 'react';
import MaterialTable, { Action, Column, Options } from '@material-table/core';
import { Chip, TablePagination, useMediaQuery } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';

import { useAuth0 } from '@auth0/auth0-react';
import { isAdmin } from '../../../utils/AuthUtil';
import { MovieType } from '../../../enums/MovieType';
import TableIcons from '../../../constants/TableIcons';
import styles from './movieTable.module.css';
import IMovieLibrary from '../../../interfaces/IMovieLibrary';
import globStyles from '../../../index.module.scss';
import { DESKTOP_WIDTH_MEDIA_QUERY } from '../../../constants/Constants';

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
    onDeleteClicked,
    handleClickTitle,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;
  const { user } = useAuth0();
  const isDesktopWidth = useMediaQuery(DESKTOP_WIDTH_MEDIA_QUERY);

  const getActions = ():
    | (
        | Action<IMovieLibrary>
        | ((rowData: IMovieLibrary) => Action<IMovieLibrary>)
      )[]
    | undefined => {
    return user && user?.email && isAdmin(user.email)
      ? [
          {
            tooltip: 'Delete selected movies',
            icon: () => <Delete />,
            onClick: (_: any, data: IMovieLibrary | IMovieLibrary[]) =>
              onDeleteClicked(data),
          },
        ]
      : undefined;
  };

  const getOptions = (): Options<IMovieLibrary> => {
    const retVal = {
      showTitle: false,
      search: false,
      paging: false,
      sorting: true,
      headerStyle: { fontSize: '1rem' },
      rowStyle: (rowData: any) => ({
        backgroundColor: rowData.tableData.checked
          ? 'rgba(232, 210, 192, 0.5)'
          : '#fff',
      }),
      selection: false,
    };

    if (user && user?.email && isAdmin(user.email)) {
      retVal.selection = true;
    }

    return retVal;
  };

  const getColumns = (): Column<IMovieLibrary>[] => {
    const retVal: Column<IMovieLibrary>[] = [
      {
        title: 'Title',
        field: 'title',
        width: '45%',
        render: (rowData: IMovieLibrary) => {
          return (
            <button
              type="button"
              className={styles['link-button']}
              onClick={() => handleClickTitle(rowData.imdbID)}
            >
              {rowData.title}
            </button>
          );
        },
      },
      {
        title: 'Year',
        field: 'year',
        type: 'numeric',
        width: '3%',
      },
    ];

    if (isDesktopWidth) {
      retVal.push({
        title: 'Type',
        field: 'type',
        width: '3%',
        render: (rowData: IMovieLibrary) => (
          <p>{rowData.type === MovieType.TvSeries ? 'TV' : 'MOV'}</p>
        ),
      });

      retVal.push({
        title: 'Genre',
        field: 'genre',
        width: '39%',
        sorting: false,
        render: (rowData: IMovieLibrary) => {
          return (
            <>
              {rowData.genre?.map((genre: string) => (
                <span key={genre} className={globStyles['chip-spacer']}>
                  <Chip label={genre} />
                </span>
              ))}
            </>
          );
        },
      });

      retVal.push({
        title: 'PG Rating',
        field: 'pGRating',
        width: '10%',
      });
    }
    return retVal;
  };

  return (
    <div className={styles['table-style']}>
      <MaterialTable
        columns={getColumns()}
        data={movies}
        options={getOptions()}
        actions={getActions()}
        icons={TableIcons}
      />
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
