<script setup lang="ts">
import { cn } from '@/lib/utils';
import { 
    DropdownMenuItem, 
    useForwardProps, // from reka-ui
    type DropdownMenuItemProps 
} from 'reka-ui'; // Assuming 'reka-ui' is the correct import path
import { type HTMLAttributes } from 'vue'; // 'computed' is not directly needed for this fix pattern

// Define the props for your wrapper component, extending reka-ui's props
// and adding your custom 'class' and 'inset' props.
interface CurrentComponentProps extends DropdownMenuItemProps {
  class?: HTMLAttributes['class'];
  inset?: boolean; // You had this in your original defineProps
}

const props = defineProps<CurrentComponentProps>();
// No need for withDefaults here unless DropdownMenuItemProps has defaults you want to override
// or if 'inset' needs a default, e.g., props = withDefaults(defineProps<CurrentComponentProps>(), { inset: false });

// Pass the original, reactive `props` object directly to useForwardProps.
// `useForwardProps` will then operate on this reactive object.
// If it calls `toRefs(props)` internally, it will work without warnings.
const forwardedProps = useForwardProps(props);
// `forwardedProps` will contain all properties from `props` (including your custom `class` and `inset`).
</script>

<template>
    <DropdownMenuItem
        v-bind="forwardedProps" 
        :class="
            cn(
                'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
                props.inset && 'pl-8', // Use props.inset directly for conditional class
                props.class,           // Explicitly apply your custom class
            )
        "
    >
        <slot />
    </DropdownMenuItem>
</template>