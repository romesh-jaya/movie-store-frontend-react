import React, { useState, useEffect, useCallback, useContext, ReactNode, forwardRef } from 'react';

import MaterialTable from 'material-table';
import { Chip } from '@material-ui/core';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import axios from '../../axios';
import IMovie from '../../interfaces/IMovie';

import * as globStyles from '../../index.css';
import MovieDetails from '../Movies/MovieDetails/MovieDetails';
import MovieLoadingSkeleton from '../Movies/MovieLoadingSkeleton';
import { MovieType } from '../../enums/MovieType';

const errorText = 'Error while retrieving movie data.';

interface IState {
  movies: IMovie[];
  movError: string;
  movInfo: string;
  selectedMovie: IMovie | undefined;
  isLoading: boolean;
  currentPage: number
}

const MyLibrary: React.FC = () => {
  const [state, setState] = useState<IState>({
    movies: [],
    movError: '',
    movInfo: '',
    selectedMovie: undefined,
    isLoading: false,
    currentPage: 1,
  });

  const tableIcons = {
    Add: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ViewColumn {...props} ref={ref} />)
  };

  const mergeState = useCallback((name: string, value: any): void => {
    setState(oldState => ({
      ...oldState,
      [name]: value
    }));
  }, []);


  const loadMovies = useCallback((): void => {
    mergeState('isLoading', true);

    axios.get(`${process.env.REACT_APP_NODE_SERVER}/movies`)
      .then((response: any) => {
        if (!response.data.length) {
          mergeState('selectedMovie', undefined);
          mergeState('movies', []);
          mergeState('movError', '');
          mergeState('movInfo', 'No movies have been added to library.');
          mergeState('isLoading', false);
          return;
        }

        mergeState('selectedMovie', undefined);
        mergeState('movies', response.data);
        mergeState('movError', '');
        mergeState('movInfo', '');
        mergeState('isLoading', false);
        mergeState('currentPage', 1);
      })
      .catch((err: any) => {
        console.log(err);
        mergeState('selectedMovie', undefined);
        mergeState('movies', []);

        mergeState('movInfo', '');
        mergeState('isLoading', false);

        if (err && err.response && err.response.data && err.response.data.Error) {
          mergeState('movError', `${errorText}: ${err.response.data.Error}`);
        } else {
          mergeState('movError', errorText);
        }
      });
  }, [mergeState]);


  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const renderTable = (): ReactNode => {
    return (
      <div style={{ maxWidth: '100%' }}>
        <MaterialTable
          columns={
            [
              {
                title: 'Title',
                field: 'title',
                width: '45%'
              },
              {
                title: 'Type',
                field: 'type',
                width: '3%',
                render: rowData => <p>{(rowData.type === MovieType.TvSeries) ? 'TV' : 'MOV'}</p>
              },
              {
                title: 'Year',
                field: 'year',
                type: 'numeric',
                width: '3%'
              },
              {
                title: 'Genre',
                field: 'genre',
                width: '39%',
                sorting: false,
                render: rowData => {
                  return (
                    <>
                      {
                        rowData.genre ? rowData.genre?.map(genre => (
                          <span className={globStyles['chip-spacer']}>
                            <Chip label={genre} />
                          </span>
                        )) : null
                      }
                    </>
                  );
                }
              },
              {
                title: 'PG Rating',
                field: 'pGRating',
                width: '10%'
              }
            ]
          }
          data={state.movies}
          options={
            {
              showTitle: false,
              search: false,
              paging: false,
              sorting: true,
              headerStyle: { fontSize: '1rem' },
              rowStyle: { fontSize: '0.95rem' }
            }
          }
          icons={tableIcons}
        />
      </div>
    );
  };

  const renderError = (): ReactNode | null => {
    return state.movError ? (
      <p className={globStyles['error-text']}>
        Movies can&#39;t be loaded!
        {' '}
        {state.movError}
      </p>
    ) : null;
  };

  const renderContent = (): ReactNode => {
    return (
      <>
        {renderTable()}
        <section>
          {state.selectedMovie && !state.movError ? <MovieDetails selectedMovie={state.selectedMovie} /> : null}
        </section>
        {renderError()}
        {state.movInfo ? <p>{state.movInfo}</p> : null}
      </>
    );
  };

  return (
    <>
      {state.isLoading ? <MovieLoadingSkeleton /> : renderContent()}
    </>
  );
};

export default MyLibrary;