<template>
  <v-navigation-drawer
    v-model="open"
    location="right"
    temporary
    :width="drawerWidth"
    class="drawer elevation-3"
  >
    <v-container class="pt-6 text-center">
      <v-btn
        icon
        variant="text"
        class="close-btn"
        @click="open = false"
        aria-label="Close drawer"
      >
        <v-icon color="grey">mdi-close</v-icon>
      </v-btn>

      <section>
        <h2 class="text-h6 font-weight-bold mb-1">New Account</h2>
        <p class="text-body-2 text-grey-darken-1">
          Create a new account to track your transactions.
        </p>
      </section>
    </v-container>

    <AccountForm
      ref="formRef"
      :disabled="isDisabled"
      @submit="handleSubmit"
      @delete="handleDelete"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">

import { ref, computed, defineProps, defineEmits } from 'vue'
import type { ComponentPublicInstance } from 'vue'


import { useDisplay } from 'vuetify'


import AccountForm from './AccountForm.vue'
import { useCreateAccount } from '../hooks/useCreateAccount'


interface AccountFormValues {
  name: string
}

interface AccountFormExposed {
  reset: () => void
}


const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created'): void
}>()

// Drawer open state
const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// Form handling
const formRef = ref<ComponentPublicInstance<AccountFormExposed> | null>(null)
const mutation = useCreateAccount()
const isDisabled = computed(() => mutation.isPending.value)

const handleSubmit = (values: AccountFormValues) => {
  mutation.mutate(values, {
    onSuccess: () => {
      emit('created')
      open.value = false
      formRef.value?.reset()
    },
  })
}

const handleDelete = () => {
  console.log('Delete clicked')
}

// Responsive width
const { smAndDown, width } = useDisplay()
const drawerWidth = computed(() => (smAndDown.value ? width.value || 300 : 400))
</script>

<style scoped>
.drawer {
  border-left: 1px solid #e0e0e0;
  background-color: white;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}
</style>
