import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { VehicleStatus } from '@/types/vehicles'

export const useVehicleFilters = defineStore('vehicleFilters', () => {
  const statuses = ref<VehicleStatus[]>(['online', 'offline', 'alert'])
  const searchQuery = ref<string>('')

  return { statuses, searchQuery }
})
