<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div
    :class="
      cn(
        'size-8 border-4 border-primary border-t-transparent rounded-full animate-spin',
        props.class,
      )
    "
  ></div>
</template>
