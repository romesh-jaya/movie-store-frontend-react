import * as React from 'react';

import globStyles from '../../index.module.scss';

const ErrorPage: React.FC = () => {
  return (
    <div className={globStyles['padding-30']}>Error 404 - page not found!</div>
  );
};

export default ErrorPage;
