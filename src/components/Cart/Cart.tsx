import MaterialTable, { Action, Column, Options } from '@material-table/core';
import React, { useState } from 'react';
import Delete from '@mui/icons-material/Delete';
import isArray from 'lodash/isArray';
import Button from '@mui/material/Button';

import TableIcons from '../../constants/TableIcons';
import { cartItems, ICartItem, removeItem } from '../../state/cart';
import styles from './cart.module.scss';
import MovieDetails from '../Movies/MovieDetails/MovieDetails';
import StyledMTableToolbar from '../Controls/StyledMTableToolbar/StyledMTableToolbar';

import globStyles from '../../index.module.scss';
import axios from '../../axios';

const pricePerTitleUSD = 2; // TODO: Hard coded for now

const Cart: React.FC = () => {
  const cartItemsArray = cartItems.use();
  const [selectedMovieIMDBId, setSelectedMovieIMDBId] = useState('');
  const [error, setError] = useState('');

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
        width: '85%',
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
      {
        title: 'Amount (USD)',
        field: 'amount',
        width: '15%',
        render: () => <p>{pricePerTitleUSD.toFixed(2)}</p>,
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

  const getSummaryValue = (
    column: Column<ICartItem>,
    data: ICartItem[]
  ): string | undefined => {
    switch (column.field) {
      case 'title':
        return 'Total: ';
      case 'amount':
        return data.reduce((agg) => agg + 1 * pricePerTitleUSD, 0).toFixed(2);
      default:
        return undefined;
    }
  };

  const proceedToRent = async () => {
    const titlesRented = cartItemsArray.map((item) => item.title);

    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_NODE_SERVER}/payments/create-checkout-session`,
        { titlesRented }
      );
      const newURL = response.data.url;
      console.info('Redirecting to : ', newURL);
      window.location.href = newURL;
    } catch (error) {
      setError(`Error while submitting payment: ${error}`);
    }
  };

  return (
    <div className={styles.table}>
      <h2>My Cart</h2>
      {cartItemsArray.length > 0 ? (
        <>
          <MaterialTable
            columns={getColumns()}
            data={cartItemsArray}
            options={getOptions()}
            actions={getActions()}
            icons={TableIcons}
            components={{
              Toolbar: (props) => <StyledMTableToolbar {...props} />,
            }}
            renderSummaryRow={({ column, data }) => {
              return {
                value: getSummaryValue(column, data),
                style: {
                  fontWeight: 'bold',
                  fontSize: '16px',
                  lineHeight: '3',
                },
              };
            }}
          />
          <div className={styles['button-div']}>
            <span className={globStyles['right-spacer']}>
              <Button
                id="pay-button"
                color="primary"
                variant="contained"
                autoFocus
                onClick={proceedToRent}
              >
                Proceed to Rent
              </Button>
            </span>
          </div>
          {error && <p className={globStyles['error-text']}>{error}</p>}
        </>
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
