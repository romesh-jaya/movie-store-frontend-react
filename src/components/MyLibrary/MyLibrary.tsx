import React, {
  useState,
  useCallback,
  ReactNode,
  useEffect,
  ReactElement,
} from 'react';
import MaterialTable, { Action, Column, Options } from 'material-table';
import { Chip, TablePagination, useMediaQuery } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';

import { useAuth0 } from '@auth0/auth0-react';
import styles from './myLibrary.module.css';
import * as globStyles from '../../index.module.css';
import { TextConstants } from '../../constants/TextConstants';
import axios from '../../axios';
import MovieLoadingSkeleton from '../Movies/MovieLoadingSkeleton';
import { MovieType } from '../../enums/MovieType';
import TableIcons from '../../constants/TableIcons';
import AlertConfirmation from '../UI/AlertConfirmation/AlertConfirmation';
import LibrarySearchBox from './LibrarySearchBox/LibrarySearchBox';
import { ISearchInfo } from '../../interfaces/ISearchInfo';
import IMovieLibrary from '../../interfaces/IMovieLibrary';
import MovieDetails from '../Movies/MovieDetails/MovieDetails';
import { isAdmin } from '../../utils/AuthUtil';

const MyLibrary: React.FC = () => {
  const [movies, setMovies] = useState<IMovieLibrary[]>([]);
  const [movError, setMovError] = useState('');
  const [movInfo, setMovInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchInfo, setLastSearchInfo] = useState<
    ISearchInfo | undefined
  >();
  const [lastSearchMovieCount, setLastSearchMovieCount] = useState<
    number | undefined
  >();
  const [movToDelete, setMovToDelete] = useState<IMovieLibrary[] | undefined>();
  const [selectedMovieIMDBId, setSelectedMovieIMDBId] = useState('');
  const [openDrawerValue, setOpenDrawerValue] = useState(false);
  const [pageSize, setPageSize] = React.useState(10);
  const { user } = useAuth0();
  const isDesktopWidth = useMediaQuery('(min-width:600px)');

  const queryMovies = useCallback(
    async (pageNo?: number): Promise<void> => {
      const page = pageNo ?? 1;
      const newSearchInfo = {
        ...lastSearchInfo,
        page: page - 1, // Note: the page always starts at 1 in Material UI, but 0 in the server
        pageSize,
      };
      setIsLoading(true);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_NODE_SERVER}/movies`,
          { params: newSearchInfo }
        );

        setCurrentPage(page);
        setIsLoading(false);
        if (page === 1 && !response.data.movies.movies.length) {
          // Perform this for first query only
          setMovies([]);
          setMovError('');
          setMovInfo(TextConstants.NOMOVIESFOUND);
          setLastSearchMovieCount(0);
          return;
        }

        setMovies(response.data.movies.movies);
        setMovError('');
        setMovInfo('');
        setLastSearchMovieCount(response.data.movies.movieCount[0].count);
      } catch (err) {
        setMovies([]);
        setMovInfo('');
        setIsLoading(false);
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.Error
        ) {
          setMovError(
            `${TextConstants.MOVIELOADERROR}: ${err.response.data.Error}`
          );
        } else {
          setMovError(TextConstants.MOVIELOADERROR);
        }
        setLastSearchMovieCount(0);
      }
    },
    [lastSearchInfo, pageSize]
  );

  const deleteMovies = useCallback(async (): Promise<void> => {
    const idArray = movToDelete?.map((movie) => movie.id);

    if (idArray) {
      setMovError('');
      setIsLoading(true);
      try {
        await axios.delete(`${process.env.REACT_APP_NODE_SERVER}/movies`, {
          params: { idArray },
        });
        setShowDeleteConfirm(false);
        await queryMovies(currentPage);
      } catch (err) {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.Error
        ) {
          setMovError(
            `${TextConstants.MOVIEDELETEERROR}: ${err.response.data.Error}`
          );
        } else {
          setMovError(TextConstants.MOVIEDELETEERROR);
        }
        setShowDeleteConfirm(false);
        setIsLoading(false);
      }
    }
  }, [currentPage, movToDelete, queryMovies]);

  const exportMovies = async (): Promise<IMovieLibrary[]> => {
    const newSearchInfo = {
      ...lastSearchInfo,
      queryAll: true,
    };
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NODE_SERVER}/movies`,
        { params: newSearchInfo }
      );
      setIsLoading(false);
      if (!response.data.movies.movies.length) {
        setMovError('No movies returned from server.');
        return [];
      }
      setMovError('');
      return response.data.movies.movies;
    } catch (err) {
      setIsLoading(false);
      if (err && err.response && err.response.data && err.response.data.Error) {
        setMovError(
          `${TextConstants.MOVIELOADERROR}: ${err.response.data.Error}`
        );
      } else {
        setMovError(TextConstants.MOVIELOADERROR);
      }
    }
    return [];
  };

  const handleDrawerCloseFromDrawer = (): void => {
    setOpenDrawerValue(false);
  };

  const handleClickTitle = (imdbID: string): void => {
    setSelectedMovieIMDBId(imdbID);
    setOpenDrawerValue(true);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void => {
    // Note: the page always starts at 1 in Material UI
    queryMovies(page + 1);
  };

  useEffect(() => {
    if (lastSearchInfo) {
      queryMovies();
    }
  }, [lastSearchInfo, queryMovies]);

  const onDeleteClicked = (data: IMovieLibrary | IMovieLibrary[]): void => {
    setShowDeleteConfirm(true);
    if (Array.isArray(data)) {
      setMovToDelete(data);
    } else {
      setMovToDelete([data]);
    }
  };

  const onCancelledDelete = (): void => {
    setShowDeleteConfirm(false);
  };

  const getActions = ():
    | (
        | Action<IMovieLibrary>
        | ((rowData: IMovieLibrary) => Action<IMovieLibrary>)
      )[]
    | undefined => {
    return isAdmin(user.email)
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

    if (isAdmin(user.email)) {
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

  const renderError = (): ReactNode | null => {
    return movError ? (
      <p className={globStyles['error-text']}>{movError}</p>
    ) : null;
  };

  const renderConfirmModal = (): ReactElement | null =>
    showDeleteConfirm ? (
      <AlertConfirmation
        message="Are you sure you wish to delete these movies?"
        title="Delete"
        oKButtonText="Delete"
        onConfirmed={deleteMovies}
        onCancelled={onCancelledDelete}
      />
    ) : null;

  const renderTable = (): ReactNode | null => {
    return lastSearchMovieCount ? (
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
            onChangePage={handleChangePage}
            rowsPerPage={pageSize}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPageOptions={isDesktopWidth ? [10, 25, 50] : []}
          />
        </div>
        <MovieDetails
          selectedMovieIMDBId={selectedMovieIMDBId}
          openDrawerValue={openDrawerValue}
          closeDrawer={handleDrawerCloseFromDrawer}
        />
      </div>
    ) : null;
  };

  const renderContent = (): ReactNode => {
    return (
      <>
        {renderTable()}
        {renderConfirmModal()}
        {renderError()}
        {movInfo ? <p>{movInfo}</p> : null}
      </>
    );
  };

  return (
    <>
      <LibrarySearchBox
        enableExportButton={!!lastSearchMovieCount}
        setLastSearchInfo={setLastSearchInfo}
        exportMovies={exportMovies}
      />
      {isLoading ? <MovieLoadingSkeleton /> : renderContent()}
    </>
  );
};

export default MyLibrary;
