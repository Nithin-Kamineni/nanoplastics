import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ScatterPlot, ChartsLegend  } from '@mui/x-charts';


function createSmoothCurve(x, y) {
  // Assuming x and y are arrays of the same length
  if (x.length !== y.length) {
    throw new Error('The length of x and y arrays must be the same');
  }

  // Sort the points by the x-axis
  let points = x.map((xi, i) => ({ x: xi, y: y[i] }));
  // points.sort((a, b) => a.x - b.x);

  let xlst = [];
  let ylst = [];

  // The number of intermediate points you want to create between each pair of points
  let granularity = 10;

  let curvePoints = [];

  for (let i = 0; i < points.length - 1; i++) {
    let start = points[i];
    let end = points[i + 1];

    for (let j = 0; j <= granularity; j++) {
      let t = j / granularity;
      let xt = (1 - t) * start.x + t * end.x;
      let yt = (1 - t) * start.y + t * end.y;
      curvePoints.push({ x: xt, y: yt });
      xlst.push(xt)
      ylst.push(yt)
    }
  }

  // Add the last point
  curvePoints.push(points[points.length - 1]);



  return [xlst,ylst];
}


export default function GraphComponent(props) {
  const [isResponsive, setIsResponsive] = React.useState(false);

  let {Time, LinePoints, YaxisLabel, ScatterPoints} = props;
  
  const Container = isResponsive ? ResponsiveChartContainer : ChartContainer;
  const sizingProps = { width: 700, height: 300 };

  const [smoothX, smoothY] = createSmoothCurve(LinePoints, Time);


  return (
    <Box sx={{ width: '100%'}}>
      <Paper sx={{ width: 700, height: 300, overflow: 'hidden' }} elevation={3}>
        {/* @ts-ignore */}
        <Container
          sx={{pr:2}}
          series={[
            {
                type: 'scatter',
                data: ScatterPoints,
                label: 'test2'
              },
            {
              // line: "curve",
              type: 'line',
              data: LinePoints,
              label: 'test1',
              // tension: 0.1
            },
          ]}
          // yAxis={[{ label: 'MPs concentration in spleen (mg/kg)', id: 'y-axis-id'}]}
          yAxis={[{ id: 'y-axis-id'}]}
          xAxis={[
            {
              data: Time,
              // scaleType: 'curve',
              id: 'x-axis-id',
            },
          ]}
          width={700}
          height={300}
          grid={{ vertical: true, horizontal: true }}
        >
          <ScatterPlot />
          <LinePlot />
          {/* <MarkPlot /> */}
          <ChartsXAxis label="Time" position="bottom" axisId="x-axis-id" />
          <ChartsYAxis label="MPs concentration in spleen (mg/kg)" position="right" axisId="y-axis-id" labelStyle={{fontSize:15, transform:'translateX(-770px) translateY(180px) rotate(-90deg)'}} tickLabelStyle={{fontSize:12, transform:'translateX(2px)'}}/>
          <ChartsLegend />
          
        </Container>
      </Paper>

      
    </Box>
  );
}
