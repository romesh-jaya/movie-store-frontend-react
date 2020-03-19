import Skeleton from 'react-loading-skeleton';
import React from 'react';

/* 
   Separate Skeleton component 
  - It is created with the same shape as Movie Details component
*/
const MovieDetailsSkeleton: React.FC = () => {
  return (
    <section>
      <h2 className="section-title">
        <Skeleton height={28} width={300} />
      </h2>
      <li className="card">
        <Skeleton height={180} />
        <h4 className="card-title">
          <Skeleton height={36} width="80%" />
        </h4>
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

export default MovieDetailsSkeleton;