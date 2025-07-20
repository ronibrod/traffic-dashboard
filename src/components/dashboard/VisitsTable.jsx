import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableSortLabel,
  IconButton,
  TextField,
  Typography,
  Divider,
  Paper,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Popover,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAlt from '@mui/icons-material/FilterAlt';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { createTrafficEntry, updateTrafficEntry, deleteTrafficEntry } from '../../apis/traffic'
import useVisitsTableColumns from './useVisitsTableColumns';

const VisitsTable = ({ data, mutate }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [newDate, setNewDate] = useState(dayjs());
  const [newVisits, setNewVisits] = useState('');
  const [sorting, setSorting] = useState([]);
  const [filtersAnchorEl, setFiltersAnchorEl] = useState(null);
  const [filtersOpenColumn, setFiltersOpenColumn] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const columns = useVisitsTableColumns()

  const rows = useMemo(() => {
    return data.map((item, index) => ({
      id: item.id,
      dayOfWeek: dayjs(item.date).format('dddd'),
      date: dayjs(item.date).format('YYYY-MM-DD'),
      visits: item.visits,
    }));
  }, [data]);

  const customFilterFns = {
    betweenDate: (row, columnId, filterValue) => {
      const value = dayjs(row.getValue(columnId))
      const [min, max] = filterValue || []
      const afterMin = !min || value.isSameOrAfter(dayjs(min))
      const beforeMax = !max || value.isSameOrBefore(dayjs(max))
      return afterMin && beforeMax
    },
    betweenNumber: (row, columnId, filterValue) => {
      const value = Number(row.getValue(columnId))
      const [min, max] = filterValue || []
      const aboveMin = min === '' || value >= Number(min)
      const belowMax = max === '' || value <= Number(max)
      return aboveMin && belowMax
    },
  }

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    filterFns: customFilterFns,
  });

  const handleClickFilters = (columnId) => (event) => {
    setFiltersAnchorEl(event.currentTarget);
    setFiltersOpenColumn(columnId);
  };

  const handleCloseFilters = () => {
    setFiltersAnchorEl(null);
    setFiltersOpenColumn(null);
  };

  const handleCreateNewEntry = async () => {
    try {
      await createTrafficEntry({
        date: dayjs(newDate).format('YYYY-MM-DD'),
        visits: Number(newVisits),
      })
      setAnchorEl(null)
      setNewVisits('')
      setNewDate(dayjs())
      mutate()
    } catch (err) {
      console.error('Failed to create new row:', err)
    }
  }

  const handleDelete = async (rowData) => {
    const confirmed = window.confirm(`Delete entry from ${rowData.date}?`)
    if (!confirmed) return

    try {
      await deleteTrafficEntry(rowData.id)
      mutate()
    } catch (err) {
      console.error('Failed to delete row:', err)
    }
  }

  const handleEdit = (rowData) => {
    setEditingRowId(rowData.id);
    setEditingData({ ...rowData });
  };

  const handleChangeVisits = (e) => {
    setEditingData((prev) => ({ ...prev, visits: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await updateTrafficEntry(editingRowId, {
        date: editingData.date,
        visits: Number(editingData.visits),
      });
      mutate();
      setEditingRowId(null);
      setEditingData({});
    } catch (err) {
      console.error('Failed to update row:', err);
    }
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setEditingData({});
  };

  return (
    <Paper
      sx={{
        width: '100%',
        height: '100%',
        p: 2,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant="h6" mb={1}>Visits Table</Typography>

        <Button
          variant="outlined"
          color="primary"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          {t('add_new')}
        </Button>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ p: 2, minWidth: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t('date')}
                value={newDate}
                onChange={(date) => setNewDate(date)}
                slotProps={{
                  textField: {
                    size: 'small',
                  },
                }}
              />
            </LocalizationProvider>

            <TextField
              label={t('visits')}
              size="small"
              type="number"
              value={newVisits}
              onChange={(e) => setNewVisits(e.target.value)}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button size="small" onClick={() => setAnchorEl(null)}>
                {t('cancel')}
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleCreateNewEntry}
              >
                {t('save')}
              </Button>
            </Stack>
          </Box>
        </Popover>
      </Stack>

      <TableContainer sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Table stickyHeader size="small">
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    sx={{
                      '& .filter-icon': {
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      },
                      '&:hover .filter-icon': {
                        opacity: 1,
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <Box display="flex" alignItems="center" gap={1}>
                        <TableSortLabel
                          active={!!header.column.getIsSorted()}
                          direction={header.column.getIsSorted() || 'asc'}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableSortLabel>

                        {header.column.getCanFilter() && (
                          <>
                            <IconButton
                              className="filter-icon"
                              size="small"
                              color={
                                header.column.getIsFiltered() ? 'secondary' : 'default'
                              }
                              onClick={handleClickFilters(header.column.id)}
                            >
                              <FilterAlt fontSize="small" />
                            </IconButton>

                            <Popover
                              open={filtersOpenColumn === header.column.id}
                              onClose={handleCloseFilters}
                              anchorEl={filtersAnchorEl}
                              sx={{ zIndex: 1000 }}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                              }}
                            >
                              <Paper>
                                <Box sx={{ p: 1 }}>
                                  <Filter column={header.column} table={table} />
                                </Box>
                              </Paper>
                            </Popover>
                          </>
                        )}
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
        </Table>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Table size="small">
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {cell.column.id === 'actions' ? (
                        editingRowId === row.original.id ? (
                          <Stack direction='row' justifyContent='end'>
                            <IconButton onClick={handleSave}><Check fontSize="small" /></IconButton>
                            <IconButton onClick={handleCancel}><Close fontSize="small" /></IconButton>
                          </Stack>
                        ) : (
                          <Stack direction='row' justifyContent='end'>
                            <IconButton onClick={() => handleEdit(row.original)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(row.original)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        )
                      ) : cell.column.id === 'visits' && editingRowId === row.original.id ? (
                        <TextField
                          size="small"
                          type="number"
                          value={editingData.visits}
                          onChange={handleChangeVisits}
                          sx={{ width: 80 }}
                        />
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        Showing {table.getRowModel().rows.length} rows
      </Typography>
    </Paper >
  );
};

const Filter = ({ column, table }) => {
  const { t } = useTranslation();

  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  if (Array.isArray(firstValue)) {
    return (
      <Stack sx={{ width: 300 }}>
        <Autocomplete
          fullWidth
          multiple
          value={columnFilterValue || []}
          onChange={(e, value) => column.setFilterValue(value)}
          getOptionLabel={(option) => option}
          isOptionEqualToValue={(option, val) => option === val}
          options={column.columnDef.filterOptions || []}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    );
  }

  else if (column.columnDef.meta?.filterType === 'dateRange') {
    return (
      <Stack gap={1}>
        <TextField
          type="date"
          size="small"
          value={columnFilterValue?.[0] ?? ''}
          onChange={(e) =>
            column.setFilterValue((old) => [e.target.value, old?.[1]])
          }
          label={t('from')}
        />
        <TextField
          type="date"
          size="small"
          value={columnFilterValue?.[1] ?? ''}
          onChange={(e) =>
            column.setFilterValue((old) => [old?.[0], e.target.value])
          }
          label={t('to')}
        />
      </Stack>
    )
  }

  else if (column.columnDef.meta?.filterType === 'numberRange') {
    return (
      <Stack gap={1}>
        <TextField
          type="number"
          size="small"
          value={columnFilterValue?.[0] ?? ''}
          onChange={(e) =>
            column.setFilterValue((old) => [e.target.value, old?.[1]])
          }
          label={t('min')}
        />
        <TextField
          type="number"
          size="small"
          value={columnFilterValue?.[1] ?? ''}
          onChange={(e) =>
            column.setFilterValue((old) => [old?.[0], e.target.value])
          }
          label={t('max')}
        />
      </Stack>
    )
  }

  else if (typeof firstValue === 'boolean') {
    return (
      <ToggleButtonGroup
        size="small"
        value={columnFilterValue}
        exclusive
        onChange={(e, newValue) => column.setFilterValue(newValue)}
      >
        <ToggleButton value={true}><Check fontSize="small" /></ToggleButton>
        <ToggleButton value={false}><Close fontSize="small" /></ToggleButton>
      </ToggleButtonGroup>
    );
  }

  else if (typeof firstValue === 'number') {
    return (
      <Stack gap={1}>
        <TextField
          type="number"
          size="small"
          value={columnFilterValue?.[0] ?? ''}
          onChange={(e) =>
            column.setFilterValue((old) => [e.target.value, old?.[1]])
          }
          placeholder={t('min')}
        />
        <TextField
          type="number"
          size="small"
          value={columnFilterValue?.[1] ?? ''}
          onChange={(e) =>
            column.setFilterValue((old) => [old?.[0], e.target.value])
          }
          placeholder={t('max')}
        />
      </Stack>
    );
  }

  return (
    <TextField
      size="small"
      value={columnFilterValue ?? ''}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={t('search')}
    />
  );
};

export default VisitsTable;
