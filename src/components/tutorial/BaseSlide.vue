<template>
<q-carousel-slide :name="name" class="column no-wrap flex-center" style="text-align: center">
    <q-item-label class="tutorial-title base-slide-title">{{title}}</q-item-label>
    <q-item-label v-if="subtitle" class="q-mt-md text-center text-black" style="margin-bottom: 40px; margin-top: 20px; font-size: 24px">
        {{subtitle}}
    </q-item-label>
    <slot name="mid">
        <!-- For image in the middle -->
    </slot>
    <q-item-label class="q-mt-md text-center text-black" style="margin-bottom: 20px; margin-top: 0px; font-size: 16px">
        {{description}}
    </q-item-label>
    <slot>
        <!-- For image at the end -->
    </slot>
</q-carousel-slide>
</template>

<script>
export default {
    props: {
        name: String,
        title: String,
        subtitle: {
            type: String,
            default: ''
        },
        description: String,
    }
}
</script>

<style scoped>
.base-slide-title {
    font-size: 40px;
}
</style>
