import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

export const groupTrafficData = (data, xAxis) => {
  if (xAxis === 'day') return data;

  const grouped = {};

  data.forEach(({ date, visits }) => {
    let key = 'unknown';
    const d = dayjs(date);

    if (xAxis === 'week') {
      key = `${d.year()}-W${d.isoWeek()}`;
    } else if (xAxis === 'month') {
      key = d.format('YYYY-MM');
    }

    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += visits;
  });

  return Object.entries(grouped).map(([key, visits]) => ({
    date: key,
    visits,
  }));
};

export const getRelativeTrafficData = (data, groupBy) => {
  const grouped = {};

  data.forEach(item => {
    let key;
    const date = dayjs(item.date);

    switch (groupBy) {
      case 'dayOfWeek':
        key = date.format('dddd');
        break;
      case 'dayOfMonth':
        key = date.format('D');
        break;
      case 'month':
        key = date.format('MMMM');
        break;
      default:
        key = item.date;
    }

    if (!grouped[key]) grouped[key] = { count: 0, total: 0 };
    grouped[key].count += 1;
    grouped[key].total += item.visits;
  });

  const result = Object.entries(grouped).map(([key, { total, count }]) => ({
    name: key,
    average: Number((total / count).toFixed(2)),
  }));

  const grandTotal = result.reduce((sum, d) => sum + d.average, 0);

  return result.map(d => ({
    ...d,
    percentage: Number(((d.average / grandTotal) * 100).toFixed(2)),
  }));
};
