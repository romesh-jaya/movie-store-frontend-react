import Skeleton from 'react-loading-skeleton';
import React from 'react';

/* 
   Separate Skeleton component 
  - It is created with the same shape as Movie Comtainer component
*/
const MovieContainerSkeleton: React.FC = () => {
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
      </li>
    </section>
  );
};

export default MovieContainerSkeleton;
