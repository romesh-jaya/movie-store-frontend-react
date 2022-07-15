import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  pageSize,
  redirectFromCheckoutURLCancelled,
  redirectFromCheckoutURLSuccess,
  redirectFromCheckoutURLSuccessNoCheckout,
} from '../../constants/Constants';
import { cartItems, removeItem } from '../../state/cart';
import styles from './cart.module.scss';
import globStyles from '../../index.module.scss';
import axios from '../../axios';
import { initPrices, prices, titlePriceId } from '../../state/price';
import { getPrices } from '../../api/server/server';
import CustomLink from '../CustomLink/CustomLink';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import MovieTable from '../Movies/MovieTable/MovieTable';
import Button from 'react-bootstrap/esm/Button';

const Cart: React.FC = () => {
  const cartItemsArray = cartItems.use();
  const pricesArray = prices.use();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleChangePage = (page: number): void => {
    setCurrentPage(page);
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
              <MovieTable
                lastSearchMovieCount={cartItemsArray.length}
                currentPage={currentPage}
                pageSize={pageSize}
                movies={cartItemsArray.map((item) => ({
                  title: `${item.title} - ${pricePerTitle.toFixed(
                    2
                  )} ${priceCurrency.toUpperCase()}`,
                  imdbID: item.imdbID,
                }))}
                handleChangePage={handleChangePage}
                removeMovie={(imdbIDToRemove) => removeItem(imdbIDToRemove)}
                resultsFoundText={`${cartItemsArray.length} items`}
              />
              <p className={styles['subscription-info']}>
                Your DVD subscription is currently <span>active</span>.
              </p>
              {pricePerTitle === 0 ? (
                <p className={styles['subscription-info']}>
                  Total:{' '}
                  <span>{`${(pricePerTitle * cartItemsArray.length).toFixed(
                    2
                  )} ${priceCurrency.toUpperCase()}`}</span>
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
              <div className="mt-4">
                <Button
                  id="pay-button"
                  variant="primary"
                  onClick={proceedToRent}
                >
                  Proceed to Rent
                </Button>
              </div>
            </>
          ) : (
            <p>No titles have been added to the cart.</p>
          )}
        </>
      )}
      {error && <p className={globStyles['error-text']}>{error}</p>}
    </div>
  );
};

export default Cart;
