import React from 'react';
import CanvasJSReact from '@canvasjs/react-stockcharts';
import { useEffect } from 'react';

const Chart = ({ company }) => {
  const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
  const [closePrices, setClosePrices] = React.useState([]);

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const res = await fetch(`/api/month/${company}`);
        const data = await res.json();
        const prices = data['Monthly Time Series'];
        setClosePrices(Object.keys(prices).map((key) => ({ x: new Date(key), y: Number(prices[key]['4. close']) }) ));
      } catch (error) {
        console.log('Error fetching stock prices', error);
      }
    }

    fetchStockPrices();
  }, []);

  const options = {
    charts: [{
      data: [{
        type: 'area',
        dataPoints: closePrices
      }]
    }]
  }

  return (
    <CanvasJSStockChart options={options} />  
  );
}

export default Chart