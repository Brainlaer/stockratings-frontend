<template>
    <Card>
        <template #title>Today, it's good idea to...</template>
        <template #content>
            <div class="flex flex-row  pt-10">
                <div class="flex flex-col w-full  items-end ">
                    <IconField class="w-full max-w-200">
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="search" placeholder="Search for a ticker" size="large" fluid @keydown.enter="getStockSearch()" />
                    </IconField>
                    <span class="text-xs">Find by ticker or company</span>

                </div>
            </div>

            <Tabs v-model:value="tabPos" scrollable>
                <TabList>
                    <Tab value="0">Buy</Tab>
                    <Tab value="1">Hold</Tab>
                    <Tab value="2">take a look at the ones that are growing the most
                    </Tab>
                    <Tab value="3">take a look at the ones that are decreasing the most
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <p>Top 10 to buy, ordered by update date</p>
                        <TableSuggest :products="stocksToBuy"></TableSuggest>
                    </TabPanel>
                    <TabPanel value="1">
                        <p>Top 10 to hold, ordered by update date</p>
                        <TableSuggest :products="stocksToHold"></TableSuggest>
                    </TabPanel>
                    <TabPanel value="2">
                        <p>Top 10 of the ones that are growing the most</p>
                        <TableSuggest :products="stocksGrowing"></TableSuggest>
                    </TabPanel>
                    <TabPanel value="3">
                        <p>Top 10 of the ones that are decreasing the most</p>
                        <TableSuggest :products="stocksDecreasing"></TableSuggest>
                    </TabPanel>
                    <TabPanel value="4">
                        <p class="mb-5 flex gap-1">Showing {{ offset }} to
                        <p v-if="totalRecords > (limit+offset)"> {{ limit + offset }} stocks</p>
                        <p v-if="totalRecords < (limit+offset)"> {{ totalRecords }} stocks</p>
                        from {{ totalRecords }}</p>
                        <TableSuggest :products="stocksSearch" :offset="offset"></TableSuggest>
                        <Paginator v-model:rows="limit" v-model:first="currentPage" :totalRecords="totalRecords">
                        </Paginator>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </template>
    </Card>
</template>
<script setup lang="ts">
import TableSuggest from '@/components/TableSuggest.vue';
import { stockRatingService } from '@/services/stockRating.service';
import { Card, Tabs, TabPanels, Tab, TabPanel, TabList, InputText, IconField, InputIcon, Paginator } from 'primevue';
import { onMounted, ref, watch } from 'vue';

const offset = ref(0)
const limit = ref(0)
const totalRecords = ref(0)
const currentPage = ref(0)
const stocksToBuy = ref();
const stocksToHold = ref();
const stocksDecreasing = ref();
const stocksGrowing = ref();
const stocksSearch = ref();
const search = ref('');
const tabPos = ref('0');

onMounted(() => {
    getStocksToBuy();
    getStocksToHold();
    getStocksDecreasing();
    getStocksGrowing();
})

const getStocksToBuy = async () => {
    let params = new URLSearchParams();
    params.append('sortBy', 'time,growth')
    params.append('order', 'desc ,desc')
    params.append('rating_to', 'buy')
    params.append('limit', '10')
    params.append('offset', '0')
    let response = await getAll(params);
    stocksToBuy.value = response.data
}
const getStocksToHold = async () => {
    let params = new URLSearchParams();
    params.append('sortBy', 'time,growth')
    params.append('order', 'desc,desc')
    params.append('rating_to', 'hold')
    params.append('limit', '10')
    params.append('offset', '0')
    let response = await getAll(params);
    stocksToHold.value = response.data
}
const getStocksDecreasing = async () => {
    let params = new URLSearchParams();
    params.append('sortBy', 'growth')
    params.append('order', 'asc')
    params.append('limit', '10')
    params.append('offset', '0')
    let response = await getAll(params);
    stocksDecreasing.value = response.data
}
const getStocksGrowing = async () => {
    let params = new URLSearchParams();
    params.append('sortBy', 'growth')
    params.append('order', 'desc')
    params.append('limit', '10')
    params.append('offset', '0')
    let response = await getAll(params);
    stocksGrowing.value = response.data
}
const getStockSearch = async () => {
    tabPos.value = '4'
offset.value = currentPage.value;    let params = new URLSearchParams();
    params.append('ticker', search.value)
    params.append('company', search.value)
    params.append('order', 'ticker')
    params.append('limit', String(limit.value))
    params.append('offset', String(offset.value))

    let response = await getAll(params);
    stocksSearch.value = response.data
    offset.value = response.meta.offset;
    limit.value = response.meta.limit;
    totalRecords.value = response.meta.totalRecords;
}
const getAll = async (params: URLSearchParams): Promise<any> => {
    try {
        const response = await stockRatingService.getAll(params);
        if (response.data.status === '200') {
            return response.data.success;
        }
    } catch (error) {
        return [];
    }
}
onMounted(() => {
    tabPos.value = '0'
})
watch([limit, search, currentPage], () => {


    if (search.value.length > 0 || limit.value || currentPage.value) {

        getStockSearch()
    } else {
        tabPos.value = '0'
    }
})
</script>