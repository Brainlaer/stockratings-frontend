<template>
    <DataTable :value="products" tableStyle="min-width: 50rem" scrollable>
        <Column header="#">
            <template #body="slotProps" class="font-bold">
                {{ (offset ?? 0) + slotProps.index + 1 }}
            </template>
        </Column>
        <Column frozen header="Ticker">
            <template #body="slotProps">
                <span v-tooltip="slotProps.data.company">
                    <i class="pi pi-building" style="font-size: 1rem"></i>
                    {{ slotProps.data.ticker }}
                </span>
            </template>
        </Column>
        <Column header="Target From">
            <template #body="slotProps">
                ${{ Number(slotProps.data.target_from).toFixed(2) }}
            </template>
        </Column>
        <Column header="Target To">
            <template #body="slotProps">
                ${{ Number(slotProps.data.target_to).toFixed(2) }}
            </template>
        </Column>
        <Column header="Potencial Growth">
            <template #body="slotProps">
                <Tag v-if="Number(slotProps.data.growth) >= 50" severity="success" icon="pi pi-angle-double-up"></Tag>
                <Tag v-if="Number(slotProps.data.growth) > 0 && Number(slotProps.data.growth) < 50" severity="success"
                    icon="pi pi-angle-up"></Tag>
                <Tag v-if="Number(slotProps.data.growth) == 0" severity="info" icon="pi pi-equals"></Tag>
                <Tag v-if="Number(slotProps.data.growth) < 0 && Number(slotProps.data.growth) > -50" severity="danger"
                    icon="pi pi-angle-down"></Tag>
                <Tag v-if="Number(slotProps.data.growth) <= -50" severity="danger" icon="pi pi-angle-double-down"></Tag>
                %{{ Number(slotProps.data.growth).toFixed(2) }}
            </template>
        </Column>
        <Column field="rating_to" header="Rating To"></Column>
        <Column header="Last Update">
            <template #body="slotProps">
                {{ new Date(slotProps.data.time).toLocaleDateString('Es-es', opcionesDate) }}
            </template>
        </Column>
    </DataTable>
</template>

<script setup lang="ts">
import { Input } from 'postcss';
import { DataTable, Column, Tag, Paginator } from 'primevue';
import { onMounted, ref } from 'vue';
const opcionesDate: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric"
};
const props = defineProps({
    products: {
        type: Array,
        required: false, // Set to `true` if it's mandatory
        default: () => []
    },
    paginator: Boolean,
    offset: Number
});
</script>