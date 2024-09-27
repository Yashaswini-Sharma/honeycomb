import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Honeycomb = ({ easy_count, medium_count, hard_count }) => {
  const [plotUrl, setPlotUrl] = useState('');

  useEffect(() => {
    const generatePlot = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/generate_plot', {
          easy_count,
          medium_count,
          hard_count
        }, {
          responseType: 'blob',  
        });

        const url = URL.createObjectURL(new Blob([response.data], { type: 'image/png' }));
        setPlotUrl(url);
      } catch (error) {
        console.error('Error generating plot:', error);
      }
    };

    generatePlot();
  }, [easy_count, medium_count, hard_count]);

  return (
    <div>
      <h1>Honeycomb Plot</h1>
      {plotUrl ? <img src={plotUrl} alt="Honeycomb Plot" /> : <p>Loading plot...</p>}
    </div>
  );
};

export default Honeycomb;
