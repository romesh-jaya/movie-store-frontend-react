# DVD Rental shop with client and Admin UI (React)

Movie Shop is an app that can be used for managing a movie library in a DVD rental store. Functionality is divided into 3 main categories:

1. Adding movies to the library
2. Browsing the titles available in the library
3. Configuring settings

The app also allows potential customers to login and browse the available titles.

The app is hosted here:
https://movie-shop-dev.web.app/

Quick start guide can be found here:
https://github.com/romesh-jaya/movie-store-frontend-react/blob/master/Quick%20Start%20Guide.pdf?raw=true

## Technical details

Tech Stack used:

- Vite
- Typescript
- React Skeletons
- REST API with Axios
- Lazy loading of code
- Material UI
- React material-table (@material-table/core had to be used with Vite)
- Pagination
- React Context
- Auth0 Authentication
- Export to CSV
- useMediaQuery hook
- chart-js
- Side-drawer
- Cypress e2e testing
- MERN

This project uses OMDB API to search for movie data. The latter has a 1,000 daily API call limit. Another free alternative might be TMDB: https://developers.themoviedb.org/3/getting-started

This app communicates with the backend - which is available in a separate git project: movie-shop-backend.

To deploy to Firebase, first perform a build, then run the following command from the terminal:
firebase deploy --only hosting

.env file is required for deployment. The webpack.env is required for local testing.

Note: MongoDB automatically goes to inactive state after a period of inactivity, and needs restarting manually.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

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

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
