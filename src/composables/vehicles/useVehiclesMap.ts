import { createApp, onUnmounted, reactive } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Vehicle, VehicleRouteStats } from '@/types/vehicles'
import { calculateRouteStats, getMarkerIcon } from '@/lib/utils'
import LiveVehicleMapPopup from '@/components/maps/live-vehicles/LiveVehicleMapPopup.vue'
import { END_MARKER_ICON, START_MARKER_ICON } from '@/lib/constants'

interface MapInstance {
  map: L.Map | null
  vehicleMarkers: Map<string, L.Marker>
  selectedVehicle: Vehicle | null
  currentPolyline: {
    polyline: L.Polyline
    startMarker: L.Marker
    endMarker: L.Marker
    routeStats: VehicleRouteStats
  } | null
  isInitialized: boolean
  refCount: number
  isAnimating: boolean
  pendingUpdate: { vehicles: Vehicle[] } | null
}

// Global store for all map instances
const mapInstances = reactive<Map<string, MapInstance>>(new Map())

export function useVehiclesMap(containerId: string) {
  // Get or create map instance for this container
  const getInstance = (): MapInstance => {
    if (!mapInstances.has(containerId)) {
      mapInstances.set(containerId, {
        map: null,
        vehicleMarkers: new Map(),
        selectedVehicle: null,
        currentPolyline: null,
        isInitialized: false,
        refCount: 0,
        isAnimating: false,
        pendingUpdate: null,
      })
    }
    return mapInstances.get(containerId) as MapInstance
  }

  const instance = getInstance()

  instance.refCount++

  const initializeMap = () => {
    if (instance.isInitialized) {
      return
    }

    const mapInstance = L.map(containerId, {
      center: [25.2048, 55.2708],
      zoom: 11,
    })

    instance.map = mapInstance
    instance.isInitialized = true

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance)
  }

  const fitBoundsToMarkers = () => {
    if (!instance.map || instance.vehicleMarkers.size === 0) return

    const markerPositions: L.LatLngTuple[] = []

    instance.vehicleMarkers.forEach((marker) => {
      const latLng = marker.getLatLng()
      marker.closePopup()
      markerPositions.push([latLng.lat, latLng.lng])
    })

    const bounds = L.latLngBounds(markerPositions)

    instance.map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 16,
      animate: true,
    })
  }

  const getOpenMarker = (): L.Marker | null => {
    let openMarker: L.Marker | null = null
    instance.vehicleMarkers.forEach((marker) => {
      if (marker.isPopupOpen()) {
        openMarker = marker
      }
    })

    return openMarker
  }

  const updateMarkers = (vehicles: Vehicle[]) => {
    if (!instance.map) return

    // If animating, queue the update
    if (instance.isAnimating) {
      instance.pendingUpdate = { vehicles }
      return
    }

    // Process the update immediately
    processMarkerUpdate(vehicles)
  }

  const processMarkerUpdate = (vehicles: Vehicle[]) => {
    if (!instance.map) return

    const currentVehicleIds = new Set<string>()

    vehicles.forEach((vehicle) => {
      const vehicleId = vehicle.id
      currentVehicleIds.add(vehicleId)

      const existingMarker = instance.vehicleMarkers.get(vehicleId)

      if (existingMarker) {
        const wasPopupOpen = existingMarker.isPopupOpen()

        existingMarker.setLatLng([vehicle.location.lat, vehicle.location.lng])
        existingMarker.setIcon(getMarkerIcon(vehicle.status))
        existingMarker.setPopupContent(getPopupContent(vehicle))
        existingMarker.setTooltipContent(getTooltipContent(vehicle))

        if (wasPopupOpen && instance.map && !instance.currentPolyline) {
          instance.map.panTo([vehicle.location.lat, vehicle.location.lng], {
            animate: true,
            duration: 0.5,
          })
        }

        if (instance.selectedVehicle && instance.selectedVehicle.id === vehicle.id)
          instance.selectedVehicle = vehicle
      } else {
        createMarker(vehicle)
      }
    })

    // Remove markers for vehicles that don't exist in new update
    instance.vehicleMarkers.forEach((marker, vehicleId) => {
      if (!currentVehicleIds.has(vehicleId)) {
        marker.remove()
        instance.vehicleMarkers.delete(vehicleId)
      }
    })

    // if (
    //   autoFitBounds &&
    //   instance.vehicleMarkers.size > 0 &&
    //   openMarker === null &&
    //   !instance.currentPolyline
    // ) {
    //   fitBoundsToMarkers()
    // }

    if (instance.currentPolyline) {
      drawSelectedVehiclePolyline()
    }

    // Clear the pending update after processing
    instance.pendingUpdate = null
  }

  const createMarker = (vehicle: Vehicle) => {
    const marker = L.marker([vehicle.location.lat, vehicle.location.lng])
      .addTo(instance.map as L.Map)
      .bindPopup(getPopupContent(vehicle))
      .bindTooltip(getTooltipContent(vehicle))
      .setIcon(getMarkerIcon(vehicle.status))

    marker.on('click', (e) => {
      instance.selectedVehicle = vehicle
      clearCurrentPolyline()

      if (instance.map) {
        e.target.closePopup()
        instance.isAnimating = true

        instance.map.setView(marker.getLatLng(), 17, { animate: true })
        instance.map.once('moveend', () => {
          marker.openPopup()
          instance.isAnimating = false

          // Process any pending updates
          if (instance.pendingUpdate) {
            const { vehicles } = instance.pendingUpdate
            processMarkerUpdate(vehicles)
          }
        })
      }
    })

    instance.vehicleMarkers.set(vehicle.id, marker)
  }

  const clickMarkerById = (vehicleId: string) => {
    const currentMarker = instance.vehicleMarkers.get(vehicleId)
    if (!currentMarker) return

    instance.isAnimating = true
    currentMarker.fireEvent('click')
    currentMarker.closeTooltip()
  }

  const drawSelectedVehiclePolyline = () => {
    if (!instance.selectedVehicle || !instance.map) return
    clearCurrentPolyline()

    const history = instance.selectedVehicle.history

    if (history.length < 2) return // can show toast to notify the user

    const routeStats = calculateRouteStats(history)

    const polyline = L.polyline(history, { color: 'red' })

    const startMarker = L.marker(history[0], {
      icon: START_MARKER_ICON,
    }).bindTooltip('Route Start', {
      permanent: false,
      direction: 'top',
    })

    const endMarker = L.marker(history[history.length - 1], {
      icon: END_MARKER_ICON,
    }).bindTooltip('Route end', {
      permanent: false,
      direction: 'top',
    })

    const openMarker = getOpenMarker()
    if (openMarker) openMarker.closePopup()

    instance.map.fitBounds(polyline.getBounds())

    setTimeout(() => {
      polyline.addTo(instance.map as L.Map)

      startMarker.addTo(instance.map as L.Map)
      if (endMarker) endMarker.addTo(instance.map as L.Map)
    }, 300)

    instance.currentPolyline = {
      polyline,
      routeStats,
      startMarker,
      endMarker,
    }
  }

  const clearCurrentPolyline = () => {
    if (!instance.currentPolyline) return

    instance.isAnimating = true

    instance.currentPolyline.polyline.remove()
    instance.currentPolyline.startMarker.remove()
    if (instance.currentPolyline.endMarker) instance.currentPolyline.endMarker.remove()

    instance.currentPolyline = null

    instance.isAnimating = false
  }

  const getPopupContent = (vehicle: Vehicle) => {
    const popupContainer = document.createElement('div')
    const popupApp = createApp(LiveVehicleMapPopup, {
      vehicle,
      onViewHistory: drawSelectedVehiclePolyline,
    })
    popupApp.mount(popupContainer)
    return popupContainer
  }

  const getTooltipContent = (vehicle: Vehicle) => {
    return `
      <div>
        <h3>Plate No.${vehicle.plate}</h3>
      </div>
    `
  }

  const invalidateSize = () => {
    if (instance.map === null) return

    setTimeout(() => {
      instance.map!.invalidateSize({
        animate: true,
        pan: true,
      })
      fitBoundsToMarkers()
    }, 300)
  }

  const cleanup = () => {
    instance.refCount--

    // Only cleanup when no components are using this map instance
    if (instance.refCount <= 0) {
      if (instance.map) {
        instance.map.remove()
      }
      mapInstances.delete(containerId)
    }
  }

  onUnmounted(cleanup)

  return {
    initializeMap,
    updateMarkers,
    fitBoundsToMarkers,
    invalidateSize,
    clickMarkerById,
    clearCurrentPolyline,
    instance,
  }
}
