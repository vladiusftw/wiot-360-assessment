import { formatTimeFromISO } from '@/lib/utils'
import type { Vehicle } from '@/types/vehicles'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

export const vehiclesTableColumns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'plate',
    header: 'Plate',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'address',
    header: 'Last Location',
    cell: ({ row }) => {
      const address = row.original.address
      let formattedAddress = ''
      if (address && address.road) formattedAddress += `${address.road}, `
      if (address && address.neighbourhood) formattedAddress += `${address.neighbourhood}, `
      if (address && address.city) formattedAddress += `${address.city}`
      return h('div', {}, formattedAddress)
    },
  },
  {
    accessorKey: 'lastUpdated',
    header: 'Last Updated Time',
    cell: ({ row }) => {
      const timestamp = row.original.lastUpdated
      const formattedTime = formatTimeFromISO(timestamp)

      return h('div', {}, formattedTime)
    },
  },
]
