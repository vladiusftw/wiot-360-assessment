import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { markerIcons } from './constants'
import type { VehicleRoutePoint, VehicleRouteStats, VehicleStatus } from '@/types/vehicles'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to generate random history points
export function generateHistory(count: number) {
  const history = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000) // 30 minutes apart
    history.push({
      lat: 25.276987 + (Math.random() - 0.5) * 0.02,
      lng: 55.296249 + (Math.random() - 0.5) * 0.02,
      timestamp: timestamp.toISOString(),
    })
  }

  return history.reverse()
}

export function getMarkerIcon(status: VehicleStatus) {
  // Example logic - adjust based on your Vehicle type and business rules
  switch (status) {
    case 'online':
      return markerIcons.green
    case 'offline':
      return markerIcons.grey
    case 'alert':
      return markerIcons.red
    default:
      return markerIcons.blue
  }
}

export function formatTimeFromISO(timestamp: string) {
  const date = new Date(timestamp)

  return date.toLocaleString('en-Us', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export async function processWithConcurrency<T, R>(
  items: T[],
  asyncFn: (item: T) => Promise<R>,
  concurrency: number = 3,
): Promise<R[]> {
  let index = 0
  const results = new Array<R>(items.length)

  async function worker(): Promise<void> {
    const currentIndex = index++

    if (currentIndex >= items.length) {
      return
    }

    results[currentIndex] = await asyncFn(items[currentIndex])
    await worker()
  }

  const workers = Array(concurrency)
    .fill(null)
    .map(() => worker())
  await Promise.all(workers)

  return results
}

export function getRandomElement<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function formatDuration(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function calculateRouteStats(history: VehicleRoutePoint[]): VehicleRouteStats {
  if (history.length < 2) {
    return {
      distance: '0.00',
      duration: '0 min',
      avgSpeed: '0.00',
      maxSpeed: '0.00',
      startTime: '-',
      endTime: '-',
      totalPoints: 0,
    }
  }

  let totalDistance = 0
  let maxSpeed = 0
  const speeds: number[] = []

  // Calculate distance and speeds between consecutive points
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1]
    const curr = history[i]

    // Calculate distance between points
    const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng)
    totalDistance += distance

    // Calculate time difference
    const timeDiff =
      (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000 / 3600 // hours

    if (timeDiff > 0) {
      // Calculate speed (km/h)
      const speed = distance / timeDiff
      speeds.push(speed)
      maxSpeed = Math.max(maxSpeed, speed)
    }
  }

  // Calculate total duration
  const startTime = new Date(history[0].timestamp)
  const endTime = new Date(history[history.length - 1].timestamp)
  const totalDuration = endTime.getTime() - startTime.getTime()

  // Calculate average speed
  const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0

  return {
    distance: totalDistance.toFixed(2),
    duration: formatDuration(totalDuration),
    avgSpeed: avgSpeed.toFixed(2),
    maxSpeed: maxSpeed.toFixed(2),
    startTime: startTime.toLocaleTimeString(),
    endTime: endTime.toLocaleTimeString(),
    totalPoints: history.length,
  }
}
