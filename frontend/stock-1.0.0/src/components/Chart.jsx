import React from 'react';
import CanvasJSReact from '@canvasjs/react-stockcharts';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Chart = ({ company }) => {
  const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
  const { id } = useParams();
  const [closePrices, setClosePrices] = React.useState([]);

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API + `/prices/day/${company}`);
        const data = await res.json();
        const prices = data.map((price) => ({x: new Date(price.date), y: Number(price.price)}));
        setClosePrices(prices);
      } catch (error) {
        console.log('Error fetching stock prices', error);
      }
    }

    fetchStockPrices();
  }, [id]);

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
};

export default Chart;