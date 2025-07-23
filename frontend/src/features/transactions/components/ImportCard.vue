<template>
    <div class="d-flex flex-lg-row align-start align-lg-center justify-lg-space-between ga-2">

        <v-card-title class="text-h6 text-truncate">Import Transaction</v-card-title>
        <v-btn color="primary" variant="flat" size="small" @click="onCancel">
            Cancel
        </v-btn>
    </div>
    <ImportTable :data="data" :selected-columns="selectedColumns || {}" :column-options="columnOptions"
        @table-head-select-change="onTableHeadSelectChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ImportTable from './ImportTable.vue';

const props = defineProps<{
    data: Record<string, string>[];
    onCancel: () => void;
    onSubmit: (data: Record<string, string>[]) => void;
}>();

console.log('ImportCard props:', props.data);

const onTableHeadSelectChange = (columnIndex: string, value: string | null) => {
    console.log('Column index:', columnIndex, 'Selected value:', value);
    const newSelectedColumns = { ...selectedColumns.value };
    for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
            newSelectedColumns[key] = null;
        }
    }

    if (value === 'Ignore') {
        newSelectedColumns[columnIndex] = null;
    } else {
        newSelectedColumns[columnIndex] = value;
    }
    selectedColumns.value = newSelectedColumns;
    console.log('Updated selected columns:', selectedColumns.value);
}


const selectedColumns = ref<SelectedColumnsState>({});
if (props.data.length > 0) {
    Object.keys(props.data[0] ?? {}).forEach((_, index) => {
        selectedColumns.value[index.toString()] = null;
    });
}

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = [
    "amount", "date", "payee"
]

const columnOptions = [
    "Ignore",
    "Date",
    "Payee",
    "Withdrawal",
    "Deposit",
    "Balance",
    "Notes",
    "Amount",
];

interface SelectedColumnsState {
    [key: string]: string | null;
}

</script>