<script setup lang="ts">
import { useVehicles } from '@/composables/vehicles/useVehicles'
import { vehiclesTableColumns } from './VehiclesTableColumns'
import { useVehicleFilters } from '@/stores/vehicleFilters'
import Spinner from '@/components/common/Spinner.vue'
import { useVehiclesMap } from '@/composables/vehicles/useVehiclesMap'
import type { Vehicle } from '@/types/vehicles'
import VehiclesTable from './VehiclesTable.vue'
import VehiclesTableFilters from './VehiclesTableFilters.vue'
import { storeToRefs } from 'pinia'

const { clickMarkerById } = useVehiclesMap('map')

const vehicleFilters = useVehicleFilters()
const { searchQuery, statuses } = storeToRefs(vehicleFilters)
const { vehicles, isLoading, isError } = useVehicles({
  searchQuery,
  statuses,
})

const handleRowClick = (vehicle: Vehicle) => {
  clickMarkerById(vehicle.id)
}
</script>

<template>
  <div class="p-4 flex flex-col h-full">
    <div
      v-if="isLoading && vehicles === undefined"
      class="flex flex-col items-center justify-center h-full"
    >
      <Spinner class="size-12" />
    </div>
    <div v-else-if="isError || vehicles === undefined">An error has occured</div>
    <div v-else class="flex flex-col gap-4">
      <VehiclesTableFilters />
      <VehiclesTable :columns="vehiclesTableColumns" :data="vehicles" @row-click="handleRowClick" />
    </div>
  </div>
</template>
