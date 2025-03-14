<template>
    <Card class="min-h-screen">
        <template #title>
            Stock detail
        </template>
        <template #content>
            <p class="pt-10 pb-6">Last update: {{ new Date(stock?.time).toLocaleDateString('Es-es', opcionesDate) }}
            </p>

            <div class="flex justify-center">
                <div class="flex flex-col gap-4 w-full sm:w-250">
                    <div class="flex gap-4 w-full flex-wrap">
                        <div class="flex-col flex-1 gap-3 items-center min-w-60">
                            <p class=" mb-2 text-s">Ticker </p>
                            <p class="text-lg">{{ stock?.ticker }}</p>
                        </div>
                        <div class="flex-col flex-1 gap-3 items-center min-w-60">
                            <h1 class=" mb-2 text-s">Company </h1>
                            <p class="text-lg">{{ stock?.company }}</p>
                        </div>
                    </div>
                    <div class="flex gap-4 w-full flex-wrap">
                        <div class="flex-col flex-1 gap-3 items-center min-w-60">
                            <h1 class=" mb-2 text-s">Action </h1>
                            <p class="text-lg">{{ stock?.action }}</p>
                        </div>
                        <div class="flex-col flex-1 gap-3 items-center min-w-60">
                            <h1 class=" mb-2 text-s">Brokerage </h1>
                            <p class="text-lg">{{ stock?.brokerage }}</p>
                        </div>
                    </div>
                    <div class="flex gap-4 w-full flex-wrap">
                        <div class="flex-col flex-1 gap-3 items-center min-w-60">
                            <h1 class=" mb-2 text-s">Target From </h1>
                            <p class="text-lg">{{ stock?.target_from }}</p>
                        </div>
                        <div class="flex-col flex-1 gap-3 items-center min-w-60">
                            <h1 class=" mb-2 text-s">Target To </h1>
                            <p class="text-lg">{{ stock?.target_to }}</p>
                        </div>
                    </div>
                    <div class="flex gap-4 w-full flex-wrap">
                        <div class="flex-col flex-1 gap-3 items-center min-w-60">
                            <h1 class=" mb-2 text-s">Rating From </h1>
                            <p class="text-lg">{{ stock?.rating_from }}</p>
                        </div>
                        <div class="flex-col flex-1 gap-3 items-center min-w-60">
                            <h1 class=" mb-2 text-s">Rating To </h1>
                            <p class="text-lg">{{ stock?.rating_to }}</p>
                        </div>
                    </div>
                    <div class="flex pt-10 gap-3 items-center">
                        <Button icon="pi pi-arrow-left" severity="secondary" @click="goTo('stockRatingList')"
                            size="large" />
                        <Button label="Delete" severity="danger" icon="pi pi-trash" @click="deleteOne()" />
                        <Button label="Update" icon="pi pi-pencil" @click="goTo('stockRatingEdit', stock.id)" />

                    </div>
                </div>

            </div>

        </template>
    </Card>
</template>

<script setup lang="ts">
import { Card, InputText, Message, Button, useToast } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { stockRatingService } from '@/services/stockRating.service';
import router from '@/router';

const toast = useToast();
const id = ref('');
const stock = ref()
const route = useRoute();
onMounted(() => {
    id.value = String(route.params.id);
    getStock();
})

const getStock = () => {
    stockRatingService.getOne(id.value).then((response) => {
        stock.value = response.data.success.data
        stock.value.target_to = Number(stock.value.target_to).toFixed(2)
        stock.value.target_from = Number(stock.value.target_from).toFixed(2)
    })
}
const goTo = (viewName: string, id?: string) => {
    router.push({ name: viewName, params: { id: id } })
}

const deleteOne = () => {
    stockRatingService.delete(id.value).then((response) => {
        if (response.data.status == '200') {
            toast.add({
                severity: 'success',
                summary: 'Stock deleted successfully.',
                life: 3000
            });
            goTo('stockRatingList');
        }
        else if (response.data.status) {
            toast.add({
                severity: 'error',
                summary: response.data.status + ': ' + response.data.error.details,
                life: 3000
            });
        }
        else {
            toast.add({
                severity: 'error',
                summary: 'Server error',
                life: 3000
            });
        }

    })
}
const opcionesDate: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric"
};

</script>