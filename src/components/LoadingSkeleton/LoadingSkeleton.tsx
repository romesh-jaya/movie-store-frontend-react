import React from 'react';
import Skeleton from 'react-loading-skeleton';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-75 my-4 mx-auto">
      <h1>
        <Skeleton />
      </h1>
      <Skeleton count={4} />
    </div>
  );
};

export default LoadingSkeleton;
