import React, { useState, useEffect, ReactElement } from 'react';
import { Bar } from 'react-chartjs-2';

import globStyles from '../../index.module.scss';
import axios from '../../axios';
import { TextConstants } from '../../constants/TextConstants';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';

const CHART_OPTIONS = {
  responsive: false,
  layout: {
    padding: {
      left: 50,
      top: 20,
      bottom: 50,
    },
  },
};

const MovieAnalysis: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chartDataLib, setChartDataLib] = useState<any>();
  const [chartDataSearch, setChartDataSearch] = useState<any>();

  const setChartDataInternalLib = (analysisData: any[]): void => {
    const genres: string[] = [];
    const genreCounts: number[] = [];

    analysisData.forEach((dataOne) => {
      genres.push(dataOne.genre);
      genreCounts.push(dataOne.count);
    });

    const data = {
      labels: genres,
      datasets: [
        {
          label: '# of Movies',
          data: genreCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
    setChartDataLib(data);
  };

  const setChartDataInternalSearch = (analysisData: any[]): void => {
    const genres: string[] = [];
    const genreCounts: number[] = [];

    analysisData.forEach((dataOne) => {
      genres.push(dataOne.genre);
      genreCounts.push(dataOne.count);
    });

    const data = {
      labels: genres,
      datasets: [
        {
          label: '# of Movies',
          data: genreCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
    setChartDataSearch(data);
  };

  // load the analysis data
  useEffect(() => {
    async function loadLanguages(): Promise<void> {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_SERVER}/movies/analysis/lib`
        );
        const resSearch = await axios.get(
          `${import.meta.env.VITE_NODE_SERVER}/movies/analysis/search`
        );
        if (response.data) {
          setChartDataInternalLib(response.data);
        }
        if (resSearch.data) {
          setChartDataInternalSearch(resSearch.data);
        }
      } catch (err) {
        setError(`${TextConstants.CHARTLOADERROR}: ${err}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadLanguages();
  }, []);

  const renderContent = (): ReactElement | null => {
    if (error) {
      return null;
    }

    return (
      <div className="my-4">
        <h2 className="mb-4">Library Movie Analysis</h2>
        <p>Below chart displays top 5 genres of all titles in the library.</p>
        {chartDataLib && (
          <Bar
            data={chartDataLib}
            height={500}
            width={500}
            options={CHART_OPTIONS}
          />
        )}
        <h2 className="mb-4">Search Movie Analysis</h2>
        <p>
          Below chart displays top 5 genres of all titles that users viewed
          details of, the past month.
        </p>
        {chartDataSearch && (
          <Bar
            data={chartDataSearch}
            height={500}
            width={500}
            options={CHART_OPTIONS}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {isLoading ? <LoadingSkeleton /> : renderContent()}
      {error && <p className={globStyles['error-text']}>{error}</p>}
    </>
  );
};

export default MovieAnalysis;
