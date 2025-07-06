<template>
    <div>
        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" accept=".json" />
        <v-btn @click="openFileDialog">Bulk Create</v-btn>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBulkCreateTransactions } from '../hooks/useBulkCreateTransactions';

const fileInput = ref<HTMLInputElement | null>(null);
const bulkCreate = useBulkCreateTransactions();

const openFileDialog = () => {
    fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result;
                if (typeof content === 'string') {
                    const transactions = JSON.parse(content);
                    await bulkCreate.mutateAsync(transactions);
                }
            } catch (error) {
                console.error('Error processing file:', error);
            }
        };
        reader.readAsText(file);
    }
};
</script>