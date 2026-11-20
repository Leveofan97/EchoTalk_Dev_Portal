<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-label" :for="controlId">{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="controlId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      class="ui-control"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" :id="errorId" class="input-error" role="alert">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'

// У компонента корневой div. Без inheritAttrs: false / v-bind="$attrs"
// required, maxlength, autocomplete и другие HTML-атрибуты попадали на div,
// а не на реальное поле ввода.
defineOptions({ inheritAttrs: false })

interface Props {
  modelValue: string
  id?: string
  label?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  label: '',
  placeholder: '',
  disabled: false,
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const generatedId = useId()
const controlId = computed(() => props.id || generatedId)
const errorId = computed(() => `${controlId.value}-error`)
const describedBy = computed(() => {
  const external = attrs['aria-describedby']
  const ids = [typeof external === 'string' ? external : '', props.error ? errorId.value : '']
  return ids.filter(Boolean).join(' ') || undefined
})
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.input-error {
  font-size: 0.75rem;
  color: var(--control-error);
}
</style>
