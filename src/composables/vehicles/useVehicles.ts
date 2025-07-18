import { getVehicles } from '@/services/vehicles'
import type { VehicleStatus } from '@/types/vehicles'
import { useQuery } from '@tanstack/vue-query'
import { computed, ref, watch, type Ref } from 'vue'

type Filters = {
  searchQuery: Ref<string>
  statuses: Ref<VehicleStatus[]>
}

export function useVehicles({ searchQuery, statuses }: Filters) {
  const isPolling = ref(true)

  const {
    data: vehicles,
    isLoading,
    isError,
    isFetching,
    refetch: refetchVehicles,
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getVehicles({ searchQuery: searchQuery.value, statuses: statuses.value }),
    refetchInterval: computed(() => (isPolling.value ? 4000 : false)),
    refetchIntervalInBackground: true,
    staleTime: 1000,
    gcTime: 30000,
  })

  const togglePolling = () => {
    isPolling.value = !isPolling.value
  }

  watch(
    () => [searchQuery.value, statuses.value],
    () => {
      console.log('statuses', statuses)
      refetchVehicles()
    },
  )

  return {
    vehicles,
    isLoading,
    isError,
    isFetching,
    refetchVehicles,
    togglePolling,
    isPolling,
  }
}
