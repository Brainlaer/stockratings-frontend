<template>
    <Card class="min-h-screen">
        <template #title>
            <p v-if="id">Update stock</p>
            <p v-else>Create stock</p>
        </template>
        <template #content>
            <p v-if="id.length > 0" class="pt-10 pb-6">Last update: {{ new Date(stock?.time).toLocaleDateString('Es-es',opcionesDate) }}</p>

            <div class="flex justify-center">
                <div class="flex flex-col gap-4 w-full sm:w-300">
                    <div class="flex justify-between gap-40">
                        <div class="flex flex-col w-full gap-4">
                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="in">
                                    <InputText id="ticker" v-model="stockForm.ticker" type="text" fluid />
                                    <label for="ticker">Ticker</label>
                                </FloatLabel>
                                <Message v-if="errors.ticker" severity="error" size="small" variant="simple">{{
                                    errors.ticker }}
                                </Message>
                            </div>

                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="in">
                                    <InputNumber id="target_from" v-model="stockForm.target_from" :min="0"
                                        :minFractionDigits="2" :maxFractionDigits="5" fluid />
                                    <label for="target_from">Target From</label>
                                </FloatLabel>
                                <Message v-if="errors.target_from" severity="error" size="small" variant="simple">{{
                                    errors.target_from }}</Message>
                            </div>

                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="in">
                                    <InputNumber id="target_to" v-model="stockForm.target_to" :min="0"
                                        :minFractionDigits="2" :maxFractionDigits="5" fluid />
                                    <label for="target_to">Target To</label>
                                </FloatLabel>
                                <Message v-if="errors.target_to" severity="error" size="small" variant="simple">{{
                                    errors.target_to
                                    }}</Message>
                            </div>

                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="in">
                                    <InputText id="company" v-model="stockForm.company" type="text" fluid />
                                    <label for="company">Company</label>
                                </FloatLabel>
                                <Message v-if="errors.company" severity="error" size="small" variant="simple">{{
                                    errors.company }}
                                </Message>
                            </div>
                        </div>
                        <div class="flex flex-col w-full gap-4">
                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="in">
                                    <InputText id="action" v-model="stockForm.action" type="text" fluid />
                                    <label for="action">Action</label>
                                </FloatLabel>
                                <Message v-if="errors.action" severity="error" size="small" variant="simple">{{
                                    errors.action }}
                                </Message>
                            </div>

                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="in">
                                    <InputText id="brokerage" v-model="stockForm.brokerage" type="text" fluid />
                                    <label for="brokerage">Brokerage</label>
                                </FloatLabel>
                                <Message v-if="errors.brokerage" severity="error" size="small" variant="simple">{{
                                    errors.brokerage
                                    }}</Message>
                            </div>

                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="in">
                                    <InputText id="rating_from" v-model="stockForm.rating_from" type="text" fluid />
                                    <label for="rating_from">Rating From</label>
                                </FloatLabel>
                                <Message v-if="errors.rating_from" severity="error" size="small" variant="simple">{{
                                    errors.rating_from }}</Message>
                            </div>
                            <div class="flex flex-col gap-1">
                                <FloatLabel variant="in">
                                    <InputText id="rating_to" v-model="stockForm.rating_to" type="text" fluid />
                                    <label for="rating_to">Rating To</label>
                                </FloatLabel>
                                <Message v-if="errors.rating_to" severity="error" size="small" variant="simple">{{
                                    errors.rating_to
                                    }}</Message>
                            </div>
                        </div>
                    </div>



                    <div class="flex gap-3 items-center">
                        <Button icon="pi pi-arrow-left" severity="secondary" @click="goBack()" size="large" />
                        <Button v-if="id.length > 0" label="reset" severity="secondary" icon="pi pi-refresh"
                            @click="resetForm()" />
                        <Button label="Submit" icon="pi pi-save" @click="onSubmit" />

                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { Card, InputText, Message, Button, useToast, InputNumber, FloatLabel } from 'primevue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { stockRatingService } from '@/services/stockRating.service';
import router from '@/router';

const toast = useToast();
const route = useRoute();
const id = ref('');
const stock = ref();

const stockForm = reactive({
    ticker: '',
    target_from: 0,
    target_to: 0,
    company: '',
    action: '',
    brokerage: '',
    rating_from: '',
    rating_to: '',
    time: new Date()
});


onMounted(() => {
    id.value = route.params.id ? String(route.params.id) : "";
    if (id.value) {
        getStock();
    }
});

const getStock = () => {
    stockRatingService.getOne(id.value).then((response: any) => {
        stock.value = response.data.data;
        if (stock.value) {
            setFormValue(stock.value)
        }
    });
};
const resetForm = () => {
    setFormValue(stock.value)

}
const setFormValue = (stockInfo: any) => {
    if (stockInfo) {
        Object.assign(stockForm, {
            ticker: stockInfo.ticker || '',
            target_from: stockInfo.target_from ?? 0,
            target_to: stockInfo.target_to ?? 0,
            company: stockInfo.company || '',
            action: stockInfo.action || '',
            brokerage: stockInfo.brokerage || '',
            rating_from: stockInfo.rating_from || '',
            rating_to: stockInfo.rating_to || ''
        });
    }
}
const goBack = () => {
    if (id.value) {
        goTo('stockRatingDetail', id.value)
    } else {
        goTo('stockRatingList')

    }
}
const errors = reactive<Record<string, string>>({
    ticker: '',
    target_from: '',
    target_to: '',
    company: '',
    action: '',
    brokerage: '',
    rating_from: '',
    rating_to: ''
});

const validateForm = () => {
    let valid = true;
    Object.keys(errors).forEach((key) => (errors[key] = ''));

    if (!stockForm.ticker) {
        errors.ticker = 'Ticker is required.';
        valid = false;
    }
    if (stockForm.target_from == null || stockForm.target_from <= 0) {
        errors.target_from = 'Target From must be a positive number.';
        valid = false;
    }
    if (stockForm.target_to == null || stockForm.target_to <= 0) {
        errors.target_to = 'Target To must be greater than zero.';
        valid = false;
    }
    if (!stockForm.company) {
        errors.company = 'Company is required.';
        valid = false;
    }
    if (!stockForm.action) {
        errors.action = 'Action is required.';
        valid = false;
    }
    if (!stockForm.brokerage) {
        errors.brokerage = 'Brokerage is required.';
        valid = false;
    }
    if (!stockForm.rating_from) {
        errors.rating_from = 'Rating From is required.';
        valid = false;
    }
    if (!stockForm.rating_to) {
        errors.rating_to = 'Rating To is required.';
        valid = false;
    }

    return valid;
};

const onSubmit = () => {
    if (validateForm() && id.value) {
        update();
    } else if (validateForm()) {
        create();
    }
};

const update = () => {
    stockRatingService.update(stockForm, String(id.value)).then((response) => {
        if (response.data.status == '200') {
            toast.add({
                severity: 'success',
                summary: 'Stock updated successfully.',
                life: 3000
            });
            goBack();
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
const create = () => {
    stockRatingService.create(stockForm).then((response) => {
        if (response.data.status == '202') {
            toast.add({
                severity: 'success',
                summary: 'Stock created successfully.',
                life: 3000
            });
            goBack();
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
const goTo = (viewName: string, id?: string) => {
    router.push({ name: viewName, params: { id: id } });
};
const opcionesDate: Intl.DateTimeFormatOptions = { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
};
</script>
