# DVD Rental shop with client and Admin UI (React with Vite)

Movie Shop is an app that can be used for managing a movie library in a DVD rental store. Functionality is divided into 3 main categories:

1. Adding movies to the library
2. Browsing the titles available in the library
3. Configuring settings

The app also allows potential customers to login and browse the available titles.

Quick start guide can be found [here](https://github.com/romesh-jaya/movie-store-frontend-react/blob/master/Quick%20Start%20Guide.pdf?raw=true).

## Technical details

Tech Stack used:

- MERN Stack
- Vite server
- Typescript
- React Loading Skeleton
- React Router v6
- Lazy loading of code
- Auth0 Authentication
- Export to CSV
- chart-js
- notistack
- Cypress e2e testing
- prefers-color-scheme media query for dark mode support
- Automatic email sending via EmailJS
- Stripe
  - Payments with pre-built checkout page and Stripe React library
  - Subscriptions
  - Webhooks for payment completion
- Paypal
  - Payments with Paypal React library
  - Subscriptions
  - Webhooks for payment completion
- Pagination
- Material UI [in this branch](https://github.com/romesh-jaya/movie-store-frontend-react/tree/material-ui)
  - useMediaQuery hook
  - Side-drawer
  - Loading skeletons
  - React material-table (@material-table/core had to be used with Vite)
- Bootstrap v5

This project uses OMDB API to search for movie data. The latter has a 1,000 daily API call limit. Another free alternative might be TMDB: https://developers.themoviedb.org/3/getting-started

## Screenshots


<p align="center">
Movie Search
</p>

<div align="center">
  <img width="902" height="894" alt="Movie Search" src="https://github.com/user-attachments/assets/948a67e6-7038-4393-b047-77dcae91eafb" style="object-fit: contain;"  />
</div>

---

<p align="center">
Movie Search results
</p>

<div align="center">
  <img width="874" height="1006" alt="Movie Search results" src="https://github.com/user-attachments/assets/bcd1b07f-91e7-4419-8f01-07abfe979b72" style="object-fit: contain;" />
</div>

---

<p align="center">
Paypal payments
</p>

<div align="center">
  <img width="778" height="588" alt="Paypal payments" src="https://github.com/user-attachments/assets/c6d8587f-2312-49b5-b208-e6a28804ef22" style="object-fit: contain;"/>
</div>








## Stripe payments

There is an environment variable, namely VITE_REDIRECT_TO_STRIPE, via which we can choose either Stripe's builtin checkout page, or our own Checkout page. For more info, https://stripe.com/docs/checkout/quickstart.

Stripe is running in TEST mode currently. Test cards to use are as follows:

- Payment succeeds: 4242 4242 4242 4242
- Payment requires authentication: 4000 0025 0000 3155
- Payment is declined: 4000 0000 0000 9995

Any CVC and expiry date will work for the above.

## PayPal payments

PayPal is running in sandbox mode currently. Test cards to use are as follows:

- Card No - 4032039029917251
- Expiry - 12/2027
- CVC - 593

## .env variables

All fields mentioned in .env.example must be filled with correct values and renamed as .env.

- VITE_SEARCH_URL - OMDB API URL
- VITE_REDIRECT_TO_STRIPE - Whether to use Stripe Prebuilt Checkout Page or React Components
- VITE_STRIPE_PK_TEST - Stripe public key
- VITE_NODE_SERVER - Backend Server URL
- VITE_PAYMENT_METHOD - either 'PAYPAL' or 'STRIPE'
- VITE_PAYPAL_CLIENT_ID - Paypal Client ID
- VITE_PAYPAL_MANAGE_SUB_URL - URL to manage client Paypal Subscriptions

## Backend Server Source

Can be found [here](https://github.com/romesh-jaya/movie-store-backend-nodejs).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
