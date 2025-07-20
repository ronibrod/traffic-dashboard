import Axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, Button, Stack, List, ListItem, Typography, Divider } from '@mui/material';
import _range from 'lodash/range';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTranslation } from 'react-i18next';
import { useTrafficData } from '../../hooks/traffic';
import TrafficUploadPopover from '../TrafficUploadPopover';
import AbsoluteTrafficChart from './AbsoluteTrafficChart';
import RelativeTrafficChart from './RelativeTrafficChart';
import VisitsTable from './VisitsTable';

dayjs.extend(weekOfYear);

const DashboardManagement = () => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'year'));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeDiv, setTimeDiv] = useState('daily');
  const [chartData, setChartData] = useState([]);
  const [xAxisData, setXAxisData] = useState([]);
  const { trafficData: data, isLoading, error, mutate } = useTrafficData();

  useEffect(() => {
    if (data.length > 0) {
      const grouped = groupDataByTimeDiv(data, timeDiv);
      setChartData(grouped.visits);
      setXAxisData(grouped.labels);
    }
  }, [data, timeDiv]);

  const totalVisits = data?.length ? data.reduce((sum, item) => sum + item.visits, 0) : 0;
  const averageVisits = data?.length ? (totalVisits / data.length).toFixed(1) : 0;

  if (isLoading) return <Typography>{t('loading')}</Typography>;
  if (error) return <Typography color="error">{t('error_loading_data')}</Typography>;

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        gap: 1,
        bgcolor: '#eee',
        p: 2,
      }}
    >
      <Stack width='100%' px={2} direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{t('dashboard')}</Typography>
        <TrafficUploadPopover mutate={mutate} />
      </Stack>
      <Divider variant='middle' sx={{ width: '100%' }} />

      <Stack width='100%' flexDirection='row' justifyContent='end' my={1} px={4} gap={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={t('from')}
            value={startDate}
            maxDate={endDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
            sx={{ bgcolor: 'white' }}
          />
          <DatePicker
            label={t('to')}
            value={endDate}
            minDate={startDate}
            maxDate={dayjs()}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
            sx={{ bgcolor: 'white' }}
          />
        </LocalizationProvider>
      </Stack>

      {!data?.length ? (
        <Stack
          sx={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#eee',
            p: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {t('no_traffic_data')}
          </Typography>
        </Stack>
      ) : (
        <Stack width='100%' height='78vh' mt={1} flexDirection='row' gap={3}>
          <Stack width="55%" height='100%' direction="column" gap={1}>
            <AbsoluteTrafficChart data={data} />
            <RelativeTrafficChart data={data} />
          </Stack>

          <Stack width="45%" height='100%' direction="column" gap={2}>
            <Stack width="100%" height='10vh'>
              <Stack
                width="100%"
                flexDirection="row"
                justifyContent="space-evenly"
                alignItems="stretch"
                gap={6}
              >
                <Stack
                  flex={1}
                  borderRadius={4}
                  px={3}
                  py={1}
                  bgcolor="white"
                  justifyContent="center"
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t('total_visits')}
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    {totalVisits}
                  </Typography>
                </Stack>

                <Stack
                  flex={1}
                  borderRadius={4}
                  px={3}
                  py={1}
                  bgcolor="white"
                  justifyContent="center"
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t('average_visits')}
                  </Typography>
                  <Typography variant="h6" color="secondary.main">
                    {averageVisits}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack
              width="100%"
              flex={1}
              overflow={'auto'}
            >
              <VisitsTable data={data} mutate={mutate} />
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

const groupDataByTimeDiv = (data, timeDiv) => {
  const grouped = {};

  data.forEach(({ date, visits }) => {
    const d = dayjs(date);
    let label;

    if (timeDiv === 'daily') {
      label = d.format('DD/MM');
    } else if (timeDiv === 'weekly') {
      label = `שבוע ${d.week()}`;
    } else if (timeDiv === 'monthly') {
      label = d.format('MM/YYYY');
    }

    if (!grouped[label]) grouped[label] = 0;
    grouped[label] += visits;
  });

  const labels = Object.keys(grouped);
  const visits = labels.map(label => grouped[label]);

  return { labels, visits };
};

export default DashboardManagement;
