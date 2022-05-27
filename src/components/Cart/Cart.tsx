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
import { Link, useNavigate } from 'react-router-dom';
import {
  redirectFromCheckoutURLCancelled,
  redirectFromCheckoutURLSuccess,
  redirectFromCheckoutURLSuccessNoCheckout,
} from '../../constants/Constants';
import Spinner from '../UI/Spinner/Spinner';
import { getPrices } from '../../api/server/server';

const Cart: React.FC = () => {
  const cartItemsArray = cartItems.use();
  const pricesArray = prices.use();
  const navigate = useNavigate();
  const [selectedMovieIMDBId, setSelectedMovieIMDBId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pricePerTitle =
    pricesArray.find((price) => price.lookupKey === titlePriceId)?.price || 0;
  const priceCurrency =
    pricesArray.find((price) => price.lookupKey === titlePriceId)?.currency ||
    '';

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
      fetchPrices();
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
      setIsLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_NODE_SERVER
        }/payments/stripe/products/create-checkout-session`,
        {
          titlesRented,
          redirectFromCheckoutURLCancelled,
          redirectFromCheckoutURLSuccess,
          redirectFromCheckoutURLSuccessNoCheckout,
        }
      );
      const { url, stripeURL } = response.data;
      if (stripeURL) {
        console.info('Redirecting to : ', stripeURL);
        // assign stripeURL to window.location.href since it is an external URL
        window.location.href = stripeURL;
        return;
      }
      navigate(url);
    } catch (error) {
      setError(`Error while submitting payment: ${error}`);
      setIsLoading(false);
    }
  };

  const fetchPrices = async () => {
    setError('');

    try {
      setIsLoading(true);
      const priceInfo = await getPrices();
      initPrices(priceInfo);
    } catch (error) {
      setError(`Error while fetching prices: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={globStyles['spinner-full-page']}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.table}>
      <h2>My Cart</h2>

      {!error && (
        <>
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
              {pricePerTitle === 0 && (
                <p className={styles['subscription-info']}>
                  Your DVD subscription is currently <span>active</span>.
                </p>
              )}
              {pricePerTitle !== 0 && (
                <p className={styles['subscription-info']}>
                  Enjoy free DVD rentals with a{' '}
                  <span>
                    <Link to="/my-subscriptions">
                      <a>Subscription</a>
                    </Link>
                  </span>
                  .
                </p>
              )}
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
            </>
          ) : (
            <p>No titles have been added to the cart.</p>
          )}
        </>
      )}
      {error && <p className={globStyles['error-text']}>{error}</p>}
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
