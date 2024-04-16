import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import {TextField} from '@mui/material';
import { Line } from "react-chartjs-2"; // Import Line from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { width } from '@mui/system';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const tension = 1;


export default function GraphComponent2({isNano, LinePoints, ScatterPoints, YaxisLabel}) {

  const yAxisTitleText = isNano ? `NPs concentration in spleen (mg/kg)` : `MPs concentration in spleen (mg/kg)`;

  const data = {
    datasets: [
      // {
      //   label: "First dataset",
      //   data: ScatterPoints,
      //   showLine: false,
      //   // backgroundColor: "rgba(75,192,192,0.2)",
      //   borderColor: "rgba(75,192,192,1)",
      // },
      {
        label: "Simulation",
        lineTension: tension,
        data: LinePoints,
        fill: false,
        borderColor: "#742774",
        pointRadius: 1,
      },
    ],
  };

    data.datasets.forEach((dataset) => {
        dataset.lineTension = tension;
      });
    

  return (
    <Box sx={{ width: '100%'}}>
        <Paper sx={{ width: 650, height: 300, overflow: 'hidden' }} elevation={3}>
        <Line
        data={data}
        options={{
            maintainAspectRatio: false, // Add this line
            scales: {
              y: {
                beginAtZero: true, 
                title: {
                    display: true,
                    text: yAxisTitleText, // Y-axis label
                  },
                grid: {
                  display: true, // Ensure grid lines are displayed
                },
                ticks: {
                  stepSize: 0.0001, // Adjusted to a smaller step size
                },
              },
              x: {
                type: "linear",
                position: "bottom",
                title: {
                    display: true,
                    text: 'Time (Day)', // X-axis label
                  },
                grid: {
                  display: true, // Ensure grid lines are displayed
                },
                ticks: {
                  autoSkip: true,
                  // Removed maxTicksLimit to allow Chart.js to determine the number of ticks based on the canvas size
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                 // Here we're using the shorthand method syntax
                 label(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  // Check if the y value is not null
                  if (context.parsed.y !== null) {
                    // Format the number with toLocaleString to avoid scientific notation for very small numbers
                    label += Number(context.parsed.y).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
                  }
                  return label;
                }
              }
            },
              legend: {
                display: true, // Make sure to display the legend
              },
            },
          }}
      />
        </Paper>

      
    </Box>
  );
}
