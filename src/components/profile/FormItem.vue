<template>
<q-item dense>
    <q-item-section>
        <q-item-label style="padding-left:5px; padding-bottom:5px; font-weight: 500">{{label}}</q-item-label>
        <slot></slot>
    </q-item-section>
</q-item>
</template>

<script>
export default {
    props: {
        label: String
    }
}
</script>

<style>

</style>
