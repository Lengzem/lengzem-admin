<script setup lang="ts">
// Your current code - This should be correct and not cause the warning
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { reactiveOmit } from '@vueuse/core' // Key import
import { DropdownMenuLabel, type DropdownMenuLabelProps, useForwardProps } from 'reka-ui'

const props = defineProps<DropdownMenuLabelProps & { class?: HTMLAttributes['class'], inset?: boolean }>()

// `delegatedProps` IS a REACTIVE object containing all props from `props`
// EXCEPT 'class' and 'inset'.
const delegatedProps = reactiveOmit(props, 'class', 'inset') 

// `useForwardProps` from reka-ui receives `delegatedProps`.
// If `useForwardProps` calls `toRefs(delegatedProps)`, it will work correctly
// because `delegatedProps` is reactive.
const forwardedProps = useForwardProps(delegatedProps) 
</script>

<template>
  <DropdownMenuLabel
    v-bind="forwardedProps"
    :class="cn(
        'px-2 py-1.5 text-sm font-medium', 
        props.inset && 'data-[inset]:pl-8', // More specific class for inset based on props.inset
        props.class
    )"
  >
    <slot />
  </DropdownMenuLabel>
</template>
