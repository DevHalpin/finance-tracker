<template>
  <v-navigation-drawer :model-value="open" @update:model-value="open = $event" location="right" temporary
    :width="drawerWidth" class="elevation-3" style="border-left: 1px solid #e0e0e0; background-color: white;">
    <v-container class="pt-6 text-center">
      <v-btn icon variant="text" class="close-btn" @click="open = false" aria-label="Close drawer">
        <v-icon color="grey">mdi-close</v-icon>
      </v-btn>


      <h2 class="text-h6 font-weight-bold mb-1">New Account</h2>
      <p class="text-body-2 text-grey-darken-1">
        Create a new account to track your transactions.
      </p>
    </v-container>
    <AccountForm ref="formRef" :disabled="isDisabled" @submit="handleSubmit" @delete="handleDelete" />
  </v-navigation-drawer>

</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue'
import { useDisplay } from 'vuetify'
import AccountForm from './AccountForm.vue'
import { useCreateAccount } from '../hooks/useCreateAccount'
import type { ComponentPublicInstance } from 'vue'

const mutation = useCreateAccount()

const isDisabled = computed(() => mutation.isPending.value)

const formRef = ref<ComponentPublicInstance<{ reset: () => void }> | null>(null)


type AccountFormValues = {
  name: string
}

const { smAndDown, width } = useDisplay()

const drawerWidth = computed(() => (smAndDown.value ? width.value : 400))

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const open = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  open.value = newVal
})

watch(open, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleSubmit = (values: AccountFormValues) => {
  mutation.mutate(values, {
    onSuccess: () => {
      open.value = false
      formRef.value?.reset()
    }
  })
}

const handleDelete = () => {
  console.log('Delete clicked')
}

</script>

<style scoped>
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}
</style>
