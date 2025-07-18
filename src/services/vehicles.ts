import { generateHistory, getRandomElement } from '@/lib/utils'
import type { GetVehiclesFilters, Vehicle } from '@/types/vehicles'
import { MOCK_ADDRESSES, STATUSES } from '@/lib/constants'

export async function getVehicles({
  searchQuery,
  statuses,
}: GetVehiclesFilters): Promise<Vehicle[]> {
  // Mock vehicles data with random updates
  const mockVehicles: Vehicle[] = Object.entries(VEHICLES)
    .map(([id, item]) => ({
      id,
      ...item,
      status: getRandomElement(STATUSES),
      location: {
        lat: 25.276987 + (Math.random() - 0.5) * 0.01,
        lng: 55.296249 + (Math.random() - 0.5) * 0.01,
      },
      address: getRandomElement(MOCK_ADDRESSES),
      lastUpdated: new Date().toISOString(),
      history: generateHistory(12),
    }))
    .filter(
      (item) =>
        statuses.includes(item.status) &&
        (searchQuery == '' ||
          item.plate.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().startsWith(searchQuery.toLowerCase())),
    )

  return mockVehicles
}

const VEHICLES: {
  [key: string]: {
    name: string
    plate: string
    type: string
  }
} = {
  'v-001': {
    name: 'Truck 1',
    plate: 'ABC-123',
    type: 'Truck',
  },
  'v-002': {
    name: 'Van 2',
    plate: 'DEF-456',
    type: 'Van',
  },
  'v-003': {
    name: 'Delivery Car 3',
    plate: 'GHI-789',
    type: 'Car',
  },
  'v-004': {
    name: 'Delivery Car 4',
    plate: 'JKL-987',
    type: 'Car',
  },
}
