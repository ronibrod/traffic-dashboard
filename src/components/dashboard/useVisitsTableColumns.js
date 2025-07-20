import { useTranslation } from 'react-i18next'

const useVisitsTableColumns = () => {
  const { t } = useTranslation()

  return [
    {
      id: 'dayOfWeek',
      header: t('day_of_week') || 'Day of Week',
      size: 150,
      accessorFn: (row) => row.dayOfWeek,
      enableGrouping: true,
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: 'includesString',
    },
    {
      id: 'date',
      header: t('date') || 'Date',
      size: 150,
      accessorFn: (row) => row.date,
      enableGrouping: false,
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: 'betweenDate',
      meta: {
        filterType: 'dateRange',
      },
    },
    {
      id: 'visits',
      header: t('visits') || 'Visits',
      size: 120,
      accessorFn: (row) => row.visits,
      enableGrouping: false,
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: 'betweenNumber',
      meta: {
        filterType: 'numberRange',
      },
    },
    {
      id: 'actions',
      header: t('actions') || 'Actions',
      size: 120,
      accessorFn: () => null,
      enableSorting: false,
      enableColumnFilter: false,
      enableGrouping: false,
    },
  ]
}

export default useVisitsTableColumns
