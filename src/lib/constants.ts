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

export const TOGGLE_STATUS_BG_COLORS: { [key in VehicleStatus]: string } = {
  online: 'data-[state=on]:bg-green-400 data-[state=off]:bg-green-400',
  alert: `data-[state=on]:bg-red-700 data-[state=off]:bg-red-700`,
  offline: `data-[state=on]:bg-gray-400 data-[state=off]:bg-gray-400`,
}

export const STATUS_BG_COLORS: { [key in VehicleStatus]: string } = {
  online: 'bg-green-400',
  alert: `bg-red-700`,
  offline: `bg-gray-400`,
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

export const START_MARKER_ICON = L.divIcon({
  className: 'route-marker start-marker',
  html: `
        <div style="
          background: #10b981; 
          color: white; 
          width: 24px; 
          height: 24px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: bold; 
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          S
        </div>
      `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

export const END_MARKER_ICON = L.divIcon({
  className: 'route-marker end-marker',
  html: `
        <div style="
          background: #ef4444; 
          color: white; 
          width: 24px; 
          height: 24px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: bold; 
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          E
        </div>
      `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})
