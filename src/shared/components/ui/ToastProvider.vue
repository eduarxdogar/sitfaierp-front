<script setup lang="ts">
import { useToast } from '@/shared/composables/use-toast';

const { toasts, removeToast } = useToast();
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-center justify-between min-w-[300px] px-4 py-3 rounded-lg shadow-lg font-medium text-sm transition-all"
        :class="{
          'bg-green-500 text-white': toast.type === 'success',
          'bg-red-500 text-white': toast.type === 'error'
        }"
      >
        <span>{{ toast.message }}</span>
        <button 
          @click="removeToast(toast.id)"
          class="ml-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
