<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { formatTimeFromISO } from '@/lib/utils'
import type { Vehicle } from '@/types/vehicles'

const emit = defineEmits<{ viewHistory: [] }>()

const { vehicle } = defineProps<{
  vehicle: Vehicle
}>()

const handleViewHistory = () => {
  emit('viewHistory')
}
</script>

<template>
  <div class="text-foreground">
    <h3>Plate: {{ vehicle.plate }}</h3>
    <p>Status: {{ vehicle.status }}</p>
    <p>Updated: {{ formatTimeFromISO(vehicle.lastUpdated) }}</p>
    <Button class="w-full" @click="handleViewHistory">View History</Button>
  </div>
</template>
