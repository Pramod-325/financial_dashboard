import React from 'react';
import Chart from 'react-apexcharts';
import { useAppContext } from '../../context/AppContext';

export const BalanceChart: React.FC = () => {
  const { theme, user } = useAppContext();
  
  // Abstracted logic to format data based on user.transactions would go here
  const series = [{ name: 'Balance', data: [3000, 4500, 3200, 5000, 4800, 6000] }];
  const options: ApexCharts.ApexOptions = {
    chart: { type: 'area', toolbar: { show: false }, background: 'transparent' },
    colors: ['#2C7A7B'],
    theme: { mode: theme },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
  };

  return <Chart options={options} series={series} type="area" height={300} />;
};