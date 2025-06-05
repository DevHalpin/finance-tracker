<template>
  <v-navigation-drawer
    v-model="open"
    location="right"
    temporary
    :width=drawerWidth
    class="elevation-3"
    style="border-left: 1px solid #e0e0e0; background-color: white;"
  >
    <v-container class="pt-6 text-center">
      <v-btn
        icon
        variant="text"
        style="position: absolute; top: 16px; right: 16px; z-index: 10;"
        @click="open = false"
      >
        <v-icon color="grey">mdi-close</v-icon>
      </v-btn>

      <h2 class="text-h6 font-weight-bold mb-1">New Account</h2>
      <p class="text-body-2 text-grey-darken-1">
        Create a new account to track your transactions.
      </p>
    </v-container>

    <v-form class="px-6 pt-2" v-model="isFormValid" @submit.prevent="submitForm">
      <v-text-field
        label="Account Name"
        variant="outlined"
        v-model="form.name"
        :rules="[rules.required]"
        class="mb-4"
      />
      <v-text-field
        label="Email"
        variant="outlined"
        v-model="form.email"
        :rules="[rules.required, rules.email]"
        class="mb-4"
      />
      <v-btn type="submit" color="primary" block class="text-none" :disabled="!isFormValid">
        Create Account
      </v-btn>
    </v-form>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown, width } = useDisplay()

const drawerWidth = computed(() => (smAndDown.value ? width.value : 400))

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const open = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  open.value = newVal
})

watch(open, (newVal) => {
  emit('update:modelValue', newVal)
})

const isFormValid = ref(false)
const form = ref({ name: '', email: '' })

const rules = {
  required: v => !!v || 'This field is required',
  email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
}

const submitForm = () => {
  if (isFormValid.value) {
    console.log('Form submitted:', form.value)
    open.value = false
  }
}
</script>
