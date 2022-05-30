import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import styles from './loadingSkeleton.module.scss';

const LoadingSkeleton: React.FC = () => {
  return (
    <Stack spacing={1} alignItems="center" className={styles.container}>
      <Skeleton width="60%" animation="wave" />
      <Skeleton height={180} width="60%" />
      <Skeleton width="60%" animation="wave" />
    </Stack>
  );
};

export default LoadingSkeleton;
