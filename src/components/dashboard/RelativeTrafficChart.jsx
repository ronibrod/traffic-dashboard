import React, { useState } from 'react';
import {
  PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  Box,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useTranslation } from 'react-i18next';
import { getRelativeTrafficData } from '../../utils/trafficLogic';

const COLORS = [
  '#A8D8FF', // Light Blue
  '#A8F0DC', // Light Teal
  '#FFE599', // Light Yellow
  '#FFD1A9', // Light Orange
  '#D3BDF0', // Light Purple
  '#F7A8C0', // Light Pink
  '#C1E1C1', // Light Green
  '#FFCCCC', // Light Red
  '#E0C9A6', // Light Brown
  '#CDE7F0', // Light Cyan
  '#F6D8AE', // Light Peach
  '#E6CCE1', // Light Lavender
];

const RelativeTrafficChart = ({ data }) => {
  const { t } = useTranslation();
  const [type, setType] = useState('pie');
  const [groupBy, setGroupBy] = useState('dayOfWeek');

  const relativeData = getRelativeTrafficData(data, groupBy);

  return (
    <Paper sx={{ p: 1.5, flex: 1, minHeight: 0, borderRadius: 4 }}>
      <Stack
        height='100%'
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={3}
      >
        <Stack height='100%' width='25%' justifyContent="space-between">
          <Stack gap={3}>
            <Typography variant="subtitle2">{t('relative_visit_distribution')}</Typography>

            <Select
              size="small"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <MenuItem value="dayOfWeek">{t('day_of_week')}</MenuItem>
              <MenuItem value="dayOfMonth">{t('day_in_month')}</MenuItem>
              <MenuItem value="month">{t('month_of_year')}</MenuItem>
            </Select>
          </Stack>

          <ToggleButtonGroup
            size="small"
            value={type}
            exclusive
            onChange={(e, newValue) => newValue && setType(newValue)}
          >
            <ToggleButton value="pie" aria-label="Pie Chart">
              <PieChartOutlineIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="bar" aria-label="Bar Chart">
              <BarChartIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <ResponsiveContainer width="75%" height="100%">
          {type === 'pie' ? (
            <Stack
              width="100%"
              height="100%"
              direction="row"
              justifyContent="space-between"
              spacing={2}
              alignItems="start"
            >
              <Stack pt={4} px={4} width='40%' height='100%' overflow='auto'>
                {relativeData.map((entry, index) => (
                  <Stack
                    key={`legend-${index}`}
                    direction="row"
                    spacing={1}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: COLORS[index % COLORS.length],
                        borderRadius: '50%',
                      }}
                    />
                    <Typography variant="caption" noWrap>
                      {entry.name} ({entry.percentage}%)
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <ResponsiveContainer width="60%" height='100%'>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={relativeData}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={10}
                          style={{ pointerEvents: 'none' }}
                        >
                          {`${relativeData[index].percentage}%`}
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {relativeData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Stack>
          ) : (
            <Stack
              width="100%"
              height="100%"
              py={2}
              px={2}
            >
              <ResponsiveContainer height='100%' width='100%'>
                <BarChart
                  data={relativeData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="2 2" />
                  <XAxis
                    dataKey="name"
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
                  <Bar dataKey="percentage" fill="#82ca9d" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </Stack>
          )}
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
};

export default RelativeTrafficChart;
