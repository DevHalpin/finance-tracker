<template>
  <v-btn @click="triggerFileInput" color="primary" variant="flat" size="small">
    <v-icon start>mdi-upload</v-icon>
    Upload CSV
    <input
      type="file"
      accept=".csv"
      ref="fileInput"
      @change="handleFileChange"
      style="display: none"
    />
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Papa from 'papaparse';

type ImportResults = {
  data: Record<string, string>[];
  errors: unknown[];
  meta: unknown;
};


const emit = defineEmits<{
  (e: 'upload', results: ImportResults): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const customHeaders = ['Date', 'Payee', 'Withdrawal', 'Deposit', 'Balance']

  Papa.parse(file, {
    header: false,
    skipEmptyLines: true,
    complete: (results) => {
        const data = (results.data as string[][]).map(row => {
          const obj: Record<string, string> = {};
          customHeaders.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        console.log('Parsed data:', data);
        emit('upload', { data, errors: results.errors, meta: results.meta });
    },
    error: (error) => {
      console.error('Error parsing file:', error);
    }
  });

  (event.target as HTMLInputElement).value = '';
}
</script>