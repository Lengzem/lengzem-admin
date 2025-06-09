<script setup lang="ts">
import { cn } from '@/lib/utils';
import {
    DropdownMenuContent,
    DropdownMenuPortal,
    useForwardPropsEmits,
    type DropdownMenuContentEmits,
    type DropdownMenuContentProps,
} from 'reka-ui'; // Assuming 'reka-ui' is the correct import path
import { type HTMLAttributes } from 'vue'; // Removed 'computed' as it's not directly needed for this fix

// Define props, including your custom 'class' and reka-ui's props
interface CurrentComponentProps extends DropdownMenuContentProps {
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<CurrentComponentProps>(), {
    sideOffset: 4, // Default from reka-ui's DropdownMenuContentProps or your own
    // Add other defaults from DropdownMenuContentProps if necessary
});

const emits = defineEmits<DropdownMenuContentEmits>();

// Pass the original, reactive `props` object to useForwardPropsEmits.
// This object is reactive, so if `useForwardPropsEmits` calls `toRefs(props)`, it will work.
// `useForwardPropsEmits` will also handle emits.
const forwarded = useForwardPropsEmits(props, emits);
// `forwarded` will now contain all props from `props` (including your `class`)
// and event listeners derived from `emits`.
</script>

<template>
    <DropdownMenuPortal>
        <DropdownMenuContent
            v-bind="forwarded"
            :class="
                cn(
                    'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    props.class, // Explicitly apply your custom class here.
                                 // If `forwarded` also spreads a `class` prop from reka-ui,
                                 // Vue's default behavior is that the :class binding (this one)
                                 // will take precedence or merge with the one from v-bind.
                                 // For string classes, the last one usually wins or they concatenate
                                 // depending on how Vue handles it with `cn`.
                                 // `cn` should handle merging multiple class sources correctly.
                )
            "
        >
            <slot />
        </DropdownMenuContent>
    </DropdownMenuPortal>
</template>