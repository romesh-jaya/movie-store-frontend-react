import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import {
  redirectFromCheckoutURLCancelled,
  redirectFromCheckoutURLSuccess,
  redirectFromCheckoutURLSuccessNoCheckout,
} from '../../constants/Constants';
import { cartItems } from '../../state/cart';
import styles from './cart.module.scss';
import MovieDetails from '../Movies/MovieDetails/MovieDetails';
import globStyles from '../../index.module.scss';
import axios from '../../axios';
import { initPrices, prices, titlePriceId } from '../../state/price';
import { getPrices } from '../../api/server/server';
import CartItemsTable from './CartItemsTable/CartItemsTable';
import CustomLink from '../CustomLink/CustomLink';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';

const Cart: React.FC = () => {
  const cartItemsArray = cartItems.use();
  const pricesArray = prices.use();
  const navigate = useNavigate();
  const [selectedMovieIMDBId, setSelectedMovieIMDBId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const pricePerTitle =
    pricesArray.find((price) => price.lookupKey === titlePriceId)?.price || 0;
  const priceCurrency =
    pricesArray.find((price) => price.lookupKey === titlePriceId)?.currency ||
    '';

  useEffect(() => {
    if (pricesArray.length === 0) {
      fetchPrices();
      return;
    }
    setIsLoading(false);
  }, []);

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
      const priceInfo = await getPrices();
      initPrices(priceInfo);
    } catch (error) {
      setError(`Error while fetching prices: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className={styles.table}>
      <h2>My Cart</h2>

      {!error && (
        <>
          {cartItemsArray.length > 0 ? (
            <>
              <CartItemsTable
                pricePerTitle={pricePerTitle}
                priceCurrency={priceCurrency}
                setSelectedMovieIMDBId={(imdbID: string) =>
                  setSelectedMovieIMDBId(imdbID)
                }
              />
              {pricePerTitle === 0 ? (
                <p className={styles['subscription-info']}>
                  Your DVD subscription is currently <span>active</span>.
                </p>
              ) : (
                <p className={styles['subscription-info']}>
                  Enjoy free DVD rentals with a{' '}
                  <span>
                    <CustomLink to="/my-subscriptions">Subscription</CustomLink>
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
