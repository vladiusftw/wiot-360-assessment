import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { markerIcons } from './constants'
import type { VehicleStatus } from '@/types/vehicles'

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
