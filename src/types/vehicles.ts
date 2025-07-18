export type VehicleStatus = 'online' | 'offline' | 'alert'

export type Vehicle = {
  id: string
  name: string
  plate: string
  type: string
  status: VehicleStatus
  location: {
    lat: number
    lng: number
  }
  address: VehicleAddress
  lastUpdated: string
  history: {
    lat: number
    lng: number
    timestamp: string
  }[]
}

export type GetVehiclesFilters = {
  statuses: VehicleStatus[]
  searchQuery: string
}

export type VehicleAddress = {
  city?: string
  country?: string
  road?: string
  neighbourhood?: string
}
