import React, { useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Bar } from 'react-chartjs-2';

import * as styles from './settings.module.css';
import * as globStyles from '../../index.module.css';
import axios from '../../axios';
import { TextConstants } from '../../constants/TextConstants';

const options = { 
  responsive: false,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  layout: {
    padding: {
      left: 50,
      top: 20,
    }
  }   
};

const MovieAnalysis: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<any>();

  const setChartDataInternal =  (analData: any[]) : void => {
    const genres: string[] = [];
    const genreCounts: number[] = [];

    analData.forEach(dataOne => {
      genres.push(dataOne._id);
      genreCounts.push(dataOne.count);
    });

    console.log(genres, genreCounts);

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
    setChartData(data);
  };

  // load the analysis data
  useEffect(() => {
    async function loadLanguages() : Promise<void> {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_NODE_SERVER}/movies/analysis/lib`);
        setIsLoading(false);
        if (response.data) {
          console.log(response.data);
          setChartDataInternal(response.data);
        } 
      } catch {
        setIsLoading(false);
        setError(TextConstants.CANNOTCONNECTSERVER);
      }
    }
        
    loadLanguages();    
  }, []);

  const renderError = (): ReactNode | null => {
    return error ? (
      <p className={globStyles['error-text']}>
        {error}
      </p>
    ) : null;
  };

  return (
    <>
      <h2 className={globStyles['margin-b-20']}>
        Library Movie Analysis
      </h2>
      <p>Below chart displays top 5 genres of all titles in the library.</p>
      {chartData? <Bar data={chartData} height={500} width={500} options={options} /> : null }
    </>
  );
};

export default MovieAnalysis;