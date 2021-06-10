<template>
<q-header class="header-class">
    <q-toolbar>
        <slot name="front">
            <!-- For front button -->
        </slot>
        <q-toolbar-title>
            <q-item-label class="title">{{ title }}</q-item-label>
        </q-toolbar-title>
        <slot>
            <!-- For button -->

        </slot>
    </q-toolbar>
</q-header>
</template>

<script>
export default {
    props: {
        title: String,
    }
}
</script>

<style scoped>
</style>
