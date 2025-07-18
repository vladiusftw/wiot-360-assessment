<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useVehicles } from '@/composables/vehicles/useVehicles'
import { useVehiclesMap } from '@/composables/vehicles/useVehiclesMap'
import Button from '@/components/ui/button/Button.vue'
import { useDebounceFn } from '@vueuse/core'
import LiveVehiclesList from './vehicles-list/LiveVehiclesList.vue'
import ResizablePanelGroup from '@/components/ui/resizable/ResizablePanelGroup.vue'
import ResizablePanel from '@/components/ui/resizable/ResizablePanel.vue'
import ResizableHandle from '@/components/ui/resizable/ResizableHandle.vue'
import { useVehicleFilters } from '@/stores/vehicleFilters'
import { storeToRefs } from 'pinia'

const vehicleFilters = useVehicleFilters()
const { searchQuery, statuses } = storeToRefs(vehicleFilters)
const { vehicles } = useVehicles({ searchQuery, statuses })
const { initializeMap, updateMarkers, invalidateSize, fitBoundsToMarkers, clearCurrentPolyline } =
  useVehiclesMap('map')

const handleResetMap = () => {
  clearCurrentPolyline()
  fitBoundsToMarkers()
}

const container = ref<HTMLElement | null>(null)
let observer: ResizeObserver | null = null

const debouncedInvalidateSize = useDebounceFn(() => {
  invalidateSize()
}, 100)

onMounted(() => {
  initializeMap()

  if (container.value) {
    observer = new ResizeObserver(() => {
      debouncedInvalidateSize()
    })
    observer.observe(container.value)
  }
})

watch(vehicles, (newVehicles) => {
  if (newVehicles) {
    updateMarkers(newVehicles)
  }
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <ResizablePanelGroup direction="horizontal" class="w-full h-full">
    <ResizablePanel :default-size="45">
      <LiveVehiclesList />
    </ResizablePanel>

    <ResizableHandle />

    <ResizablePanel class="relative flex flex-col items-center" :default-size="55">
      <div ref="container" id="map" class="w-full h-full"></div>
      <div class="mx-auto absolute top-4 z-full">
        <Button v-on:click="handleResetMap">Reset Map</Button>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
