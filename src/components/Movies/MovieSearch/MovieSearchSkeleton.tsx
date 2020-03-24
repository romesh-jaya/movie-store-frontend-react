import Skeleton from 'react-loading-skeleton';
import React from 'react';

/* 
   Separate Skeleton component 
  - It is created with the same shape as Movie Search component
*/
const MovieSearchSkeleton: React.FC = () => {
  return (
    <section>
      <h2 className="section-title">
        <Skeleton height={28} width={300} />
      </h2>
      <li className="card">
        <Skeleton height={180} />
        <p className="card-channel">
          <Skeleton width="60%" />
        </p>
        <div className="card-metrics">
          <Skeleton width="90%" />
        </div>
      </li>
    </section>
  );
};

export default MovieSearchSkeleton;