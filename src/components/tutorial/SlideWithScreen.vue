<template>
<q-carousel-slide :name="name" class="column no-wrap flex-center" style="text-align:center;">
    <div>
        <q-item-label class="tutorial-title screen-title">{{title}}</q-item-label>
        <img width="55%" alt="Scan QR Code" :src="image">
        <div class="q-mt-md text-center text-black" style="font-size: 16px">
            {{description}}
        </div>
    </div>
</q-carousel-slide>
</template>

<script>
export default {
    props: {
        name: String,
        title: String,
        description: String,
        image: String,
    },
}
</script>

<style scoped>
.screen-title {
    padding-top: 0px;
    font-size: 30px !important;
}
</style>
