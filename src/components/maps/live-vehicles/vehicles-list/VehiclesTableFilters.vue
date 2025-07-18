<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue'
import ToggleGroup from '@/components/ui/toggle-group/ToggleGroup.vue'
import ToggleGroupItem from '@/components/ui/toggle-group/ToggleGroupItem.vue'
import { STATUSES, TOGGLE_STATUS_BG_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useVehicleFilters } from '@/stores/vehicleFilters'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const vehicleFilters = useVehicleFilters()
const { searchQuery, statuses } = storeToRefs(vehicleFilters)

const localSearchQuery = ref<string>(searchQuery.value)

const setDebouncedSearchQuery = useDebounceFn((payload: string) => {
  searchQuery.value = payload
}, 300)

watch(localSearchQuery, (newValue) => {
  setDebouncedSearchQuery(newValue)
})

// Sync store changes back to local (for external updates)
watch(searchQuery, (newValue) => {
  if (localSearchQuery.value !== newValue) {
    localSearchQuery.value = newValue
  }
})
</script>

<template>
  <div class="flex gap-x-4 gap-y-1">
    <Input v-model="localSearchQuery" placeholder="Name/Plate..." />

    <ToggleGroup type="multiple" size="sm" class="gap-2" v-model="statuses">
      <ToggleGroupItem
        v-for="item in STATUSES"
        :key="item"
        :value="item"
        :class="
          cn(
            'size-4 !rounded-full p-0 border-0 hover:opacity-100 transition-all',
            TOGGLE_STATUS_BG_COLORS[item],
            statuses.includes(item) ? 'opacity-100 ' : 'opacity-60',
          )
        "
      />
    </ToggleGroup>
  </div>
</template>
