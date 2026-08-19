<script setup lang="ts">
import { cn } from '@/shared/utils/utils';

interface Props {
  modelValue?: string | number;
  class?: any;
  type?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>();

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    @input="onInput"
    :class="cn('flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900', props.class)"
    :placeholder="placeholder"
  >
</template>