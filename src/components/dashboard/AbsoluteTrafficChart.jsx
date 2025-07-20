import React, { useState } from 'react';
import {
  BarChart, LineChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  FormControl,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { groupTrafficData } from '../../utils/trafficLogic';

const AbsoluteTrafficChart = ({ data }) => {
  const [type, setType] = useState('line');
  const [xAxisType, setXAxisType] = useState('day');

  const groupedData = groupTrafficData(data, xAxisType);

  return (
    <Paper sx={{ p: 1.5, flex: 1, minHeight: 0, borderRadius: 4, }}>
      <Stack
        height='20%'
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="subtitle2" mt={-2}>
          {'Total Visits by Date'}
        </Typography>

        <Stack direction="row" gap={4}>
          <FormControl size="small">
            <Select
              native
              value={xAxisType}
              onChange={(e) => setXAxisType(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
          </FormControl>

          <ToggleButtonGroup
            size="small"
            value={type}
            exclusive
            onChange={(e, newValue) => newValue && setType(newValue)}
            sx={{ mb: 1 }}
          >
            <ToggleButton value="line" aria-label="Line Chart">
              <ShowChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="bar" aria-label="Bar Chart">
              <BarChartIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      <ResponsiveContainer width="100%" height="80%">
        {type === 'line' ? (
          <LineChart data={groupedData}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 8 }}
              height={30}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              width={30}
              allowDecimals={false}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 1, stroke: '#d88488', strokeWidth: 2 }}
            />
          </LineChart>
        ) : (
          <BarChart data={groupedData}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              height={30}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              width={30}
              allowDecimals={false}
            />
            <Tooltip />
            <Bar dataKey="visits" fill="#82ca9d" barSize={20} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Paper>
  );
};

export default AbsoluteTrafficChart;
