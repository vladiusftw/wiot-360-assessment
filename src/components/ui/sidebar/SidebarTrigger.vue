<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PanelLeftIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('size-7', props.class)"
    @click="toggleSidebar"
  >
    <PanelLeftIcon width="16" height="16" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
