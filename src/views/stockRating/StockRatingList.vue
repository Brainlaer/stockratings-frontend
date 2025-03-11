<template>

    <Card>
        <template #title>Stock Rating List</template>

        <template #content>

            <DataTable :value="products" scrollable >
                <template #header>
                    <div class="flex justify-between flex-wrap pb-10">
                        <div class="flex flex-col gap-3">
                            <span>Order By:</span>
                            <div class="flex gap-3">
                                <Select v-model="selectedOrder" :options="availableOrder" optionLabel="label"
                                    optionValue="value" placeholder="Order" defaultValue="asc" class="w-full md:w-37" />
                                <Select v-model="selectedSortable" :options="availableSortable" optionLabel="label"
                                    optionValue="value" placeholder="Sortable" defaultValue="ticker"
                                    class="w-full md:w-37" />

                            </div>
                        </div>
                        <div class="flex flex-col gap-3">
                            <span>Filter By:</span>
                            <div class="flex gap-3">
                                <div v-if="selectedFilter != 'rating_from' && selectedFilter != 'rating_to'">
                                    <IconField>
                                        <InputIcon>
                                            <i class="pi pi-search" />
                                        </InputIcon>
                                        <InputText v-model="filter" placeholder="Keyword Search"
                                            @keydown.enter="getAll()" />
                                    </IconField>
                                </div>
                                <div v-if="selectedFilter == 'rating_from' || selectedFilter == 'rating_to'">
                                    <Select v-model="filter" :options="availableRating" optionLabel="label"
                                        optionValue="value" placeholder="Select a Rating" class="w-full md:w-63" />

                                </div>
                                <Select v-model="selectedFilter" :options="availableFilters" optionLabel="label"
                                    optionValue="value" placeholder="Filters" defaultValue="ticker"
                                    class="w-full md:w-37" />

                            </div>
                        </div>
                    </div>
                </template>
                <Column header="#">
                    <template #body="slotProps" class="font-bold">
                        {{ offset + slotProps.index + 1 }}
                    </template>
                </Column>
                <Column field="ticker" frozen header="Ticker"></Column>
                <Column field="target_from" header="Target From"></Column>
                <Column field="target_to" header="Target To"></Column>
                <Column field="company" header="Company"></Column>
                <Column header="Action">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.action" :severity="getSeverity(slotProps.data)" />
                    </template>
                </Column>
                <Column field="brokerage" header="Brokerage"></Column>
                <Column field="rating_from" header="Rating From"></Column>
                <Column field="rating_to" header="Rating To"></Column>
                <Column class="w-24 !text-end">
                    <template #body="slotProps">
            <Button icon="pi pi-eye" @click="goTo('stockRatingDetail', slotProps.data.id)" severity="secondary" rounded></Button>
        </template>
                </Column>

            </DataTable>
            <Paginator v-model:rows="limit" v-model:first="currentPage" :totalRecords="totalRecords"
                :rowsPerPageOptions="[10, 20, 30]"></Paginator>
        </template>
    </Card>
</template>

<script setup lang="ts">

import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import { stockRatingService } from '@/services/stockRating.service';
import { nextTick, onMounted, ref, watch } from 'vue';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import router from '@/router';
import { useRoute } from 'vue-router';
import { InputText, IconField, InputIcon, Select, Paginator } from 'primevue';

const goTo=(viewName:string, id?:string)=>{
    router.push({name:viewName, params: { id: id } })
}
onMounted(() => {
    getAll();
})

const offset = ref(0)
const limit = ref(0)
const totalRecords = ref(0)
const currentPage = ref(0)
const products = ref()
const route = useRoute();
const searchQuery = route.query.query;
const availableFilters = ref([
    { label: 'Ticker', value: 'ticker' },
    { label: 'Company', value: 'company' },
    { label: 'Action', value: 'action' },
    { label: 'Brokerage', value: 'brokerage' },
    { label: 'Rating from', value: 'rating_from' },
    { label: 'Rating to', value: 'rating_to' },
])
const availableSortable = ref([
    { label: 'Ticker', value: 'ticker' },
    { label: 'Company', value: 'company' },
    { label: 'Action', value: 'action' },
    { label: 'Brokerage', value: 'brokerage' },
    { label: 'Rating from', value: 'rating_from' },
    { label: 'Rating to', value: 'rating_to' },
])
const availableOrder = ref([
    { label: 'Asc', value: 'asc' },
    { label: 'Desc', value: 'desc' }
])
const selectedSortable = ref('ticker')
const selectedOrder = ref('asc')
const availableRating = ref([
    { label: 'Buy', value: 'Buy' },
    { label: 'Underperform', value: 'Underperform' },
    { label: 'Outperform', value: 'Outperform' },
    { label: 'Overweight', value: 'Overweight' },
    { label: 'Underweight', value: 'Underweight' },
    { label: 'Neutral', value: 'Neutral' },
])
const selectedFilter = ref('ticker')
const filter = ref('')



const getAll = async () => {
    await nextTick(); // Espera a que Vue actualice los valores
    console.log(selectedFilter.value, selectedSortable.value, 'params')

    let params = new URLSearchParams();
    if (selectedFilter.value && (filter.value)) {
        params.append(selectedFilter.value, filter.value)
    } if (selectedSortable.value && selectedOrder.value) {
        params.append('sortBy', selectedSortable.value)
        params.append('order', selectedOrder.value)
    } if (limit.value) {
        params.append('limit', String(limit.value))
    } if (offset.value) {
        params.append('offset', String(offset.value))
    }
    console.log(selectedFilter.value, selectedSortable.value, params.toString())

    stockRatingService.getAll(params).then((response) => {
        products.value = response.data.data;
        offset.value = response.data.meta.offset;
        limit.value = response.data.meta.limit;
        totalRecords.value = response.data.meta.totalRecords;



    });
}



const getSeverity = (product: any) => {
    switch (product.action) {
        case 'reiterated by':
            return 'success';

        case 'target lowered by':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return 'info';
    }
};
watch([selectedFilter, filter, selectedSortable, selectedOrder, availableRating], () => {
    if (filter.value || selectedSortable.value || availableRating.value) {
        getAll()
    }
})
const updateOffset = () => {
    offset.value = limit.value * currentPage.value
}
watch([limit, currentPage], () => {
    if (limit.value || currentPage.value) {
        offset.value = currentPage.value;
        getAll()
        console.log(limit.value, 'limit', offset.value, 'offset', currentPage.value, 'page')
    }
})

</script>