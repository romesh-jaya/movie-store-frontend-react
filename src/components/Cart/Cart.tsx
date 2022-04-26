import MaterialTable, { Action, Column, Options } from '@material-table/core';
import React, { useEffect, useState } from 'react';
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
import { initPrices, prices, titlePriceId } from '../../state/price';
import { useNavigate } from 'react-router-dom';

const redirectFromCheckoutURLCancelled = window.location.origin.toString();
const redirectFromCheckoutURLSuccess = `${window.location.origin.toString()}/transaction-result`;

const Cart: React.FC = () => {
  const cartItemsArray = cartItems.use();
  const pricesArray = prices.use();
  const navigate = useNavigate();
  const [selectedMovieIMDBId, setSelectedMovieIMDBId] = useState('');
  const [error, setError] = useState('');
  const pricePerTitle =
    pricesArray.find((price) => price.id === titlePriceId)?.price || 0;
  const priceCurrency =
    pricesArray.find((price) => price.id === titlePriceId)?.currency || '';

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

  useEffect(() => {
    if (pricesArray.length === 0) {
      getPrices();
    }
  }, []);

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
        title: `Amount (${priceCurrency.toUpperCase()})`,
        field: 'amount',
        width: '15%',
        render: () => <p>{pricePerTitle.toFixed(2)}</p>,
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
        return data.reduce((agg) => agg + 1 * pricePerTitle, 0).toFixed(2);
      default:
        return undefined;
    }
  };

  const proceedToRent = async () => {
    const titlesRented = cartItemsArray.map((item) => item.title);

    if (import.meta.env.VITE_REDIRECT_TO_STRIPE !== 'TRUE') {
      navigate('/checkout');
      return;
    }

    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_NODE_SERVER}/payments/create-checkout-session`,
        {
          titlesRented,
          redirectFromCheckoutURLCancelled,
          redirectFromCheckoutURLSuccess,
        }
      );
      const newURL = response.data.url;
      console.info('Redirecting to : ', newURL);
      window.location.href = newURL;
    } catch (error) {
      setError(`Error while submitting payment: ${error}`);
    }
  };

  const getPrices = async () => {
    setError('');

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_SERVER}/payments/title-price`
      );
      const { price, currency } = response.data;
      initPrices([
        {
          id: titlePriceId,
          currency,
          price,
        },
      ]);
    } catch (error) {
      setError(`Error while fetching prices: ${error}`);
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
