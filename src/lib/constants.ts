import { LayoutDashboardIcon, CarIcon } from 'lucide-vue-next'
import L from 'leaflet'
import type { VehicleStatus } from '@/types/vehicles'
import type { VehicleAddress } from '@/types/vehicles'

export const SIDEBAR_ITEMS = [
  {
    title: 'Home',
    url: '/',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Vehicles',
    url: '/vehicles',
    icon: CarIcon,
  },
]

export const markerIcons = {
  red: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  blue: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  green: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  grey: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
}

export const STATUS_BG_COLORS: { [key in VehicleStatus]: string } = {
  online: 'data-[state=on]:bg-green-400 data-[state=off]:bg-green-400',
  alert: `data-[state=on]:bg-red-700 data-[state=off]:bg-red-700`,
  offline: `data-[state=on]:bg-gray-400 data-[state=off]:bg-gray-400`,
}

export const STATUSES: VehicleStatus[] = ['online', 'offline', 'alert']

export const MOCK_ADDRESSES: VehicleAddress[] = [
  {
    city: 'Dubai',
    country: 'UAE',
    road: 'Al Jamayel Street',
    neighbourhood: 'JP',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    road: 'Al Shams Street',
    neighbourhood: 'Deira',
  },
  {
    city: 'Sharjah',
    country: 'UAE',
    road: 'Al Khan Street',
    neighbourhood: 'Al Majaz',
  },
]
