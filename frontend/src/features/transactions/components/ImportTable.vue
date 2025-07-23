<template>
    <div class="rounded-md border overflow-hidden">
        <v-data-table :headers="headers" :items="tableData" item-value="id" class="pt-4" disable-sort>
            <template v-for="header in headers" #[`header.${header.value}`]="{}" :key="header.value">
                <v-select
                    :items="columnOptions"
                    :model-value="props.selectedColumns[header.value]"
                    @update:modelValue="value => emit('table-head-select-change', header.value, value)"
                    density="compact"
                    hide-details
                    variant="underlined"
                />
            </template>
        </v-data-table>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
const props = defineProps<{
    data: Record<string, string>[];
    selectedColumns: Record<string, string | null>;
    columnOptions: string[];
}>();

const emit = defineEmits<{
    (e: 'table-head-select-change', columnIndex: string, value: string | null): void;
}>();

const headers = props.selectedColumns
  ? Object.keys(props.selectedColumns).map((key) => ({
      title: key,
      value: key
    }))
  : [];

const tableData = props.data.map(row => {
  const values = Object.values(row);
  return Object.fromEntries(values.map((val, i) => [i.toString(), val]));
});
</script>