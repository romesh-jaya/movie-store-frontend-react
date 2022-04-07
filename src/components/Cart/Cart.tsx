import MaterialTable, { Action, Column, Options } from '@material-table/core';
import React, { useState } from 'react';
import Delete from '@mui/icons-material/Delete';

import TableIcons from '../../constants/TableIcons';
import { cartItems, ICartItem, removeItem } from '../../state/cart';
import styles from './cart.module.scss';
import MovieDetails from '../Movies/MovieDetails/MovieDetails';
import StyledMTableToolbar from '../Controls/StyledMTableToolbar/StyledMTableToolbar';
import isArray from 'lodash/isArray';

const Cart: React.FC = () => {
  const cartItemsArray = cartItems.use();
  const [selectedMovieIMDBId, setSelectedMovieIMDBId] = useState('');

  const onDeleteClicked = (data: ICartItem | ICartItem[]) => {
    if (isArray(data)) {
      data.forEach((dataOne) => removeItem(dataOne.imdbID));
      return;
    }

    removeItem(data.imdbID);
  };

  const handleClickTitle = (imdbID: string): void => {
    setSelectedMovieIMDBId(imdbID);
  };

  const getColumns = (): Column<ICartItem>[] => {
    return [
      {
        title: 'Title',
        field: 'title',
        render: (rowData: ICartItem) => {
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
    ];
  };

  const getOptions = (): Options<ICartItem> => {
    return {
      showTitle: false,
      search: false,
      paging: false,
      sorting: true,
      headerStyle: { fontSize: '1rem' },
      selection: true,
    };
  };

  const getActions = ():
    | (Action<ICartItem> | ((rowData: ICartItem) => Action<ICartItem>))[]
    | undefined => {
    return [
      {
        tooltip: 'Delete title',
        icon: () => <Delete />,
        onClick: (_: any, data: ICartItem | ICartItem[]) =>
          onDeleteClicked(data),
      },
    ];
  };

  return (
    <div className={styles.table}>
      <h2>My Cart</h2>
      {cartItemsArray.length > 0 ? (
        <MaterialTable
          columns={getColumns()}
          data={cartItemsArray}
          options={getOptions()}
          actions={getActions()}
          icons={TableIcons}
          components={{
            Toolbar: (props) => <StyledMTableToolbar {...props} />,
          }}
        />
      ) : (
        <p>No titles have been added to the cart.</p>
      )}
      {selectedMovieIMDBId && (
        <MovieDetails
          selectedMovieIMDBId={selectedMovieIMDBId}
          closeDrawer={() => setSelectedMovieIMDBId('')}
        />
      )}
    </div>
  );
};

export default Cart;
