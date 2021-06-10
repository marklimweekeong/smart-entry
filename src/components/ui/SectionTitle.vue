<template>
<q-item>
    <q-item-section>
        <q-item-label class="title">{{ title }}</q-item-label>
    </q-item-section>
    <q-item-section side>
        <slot>
            <!-- For button -->
        </slot>
    </q-item-section>
</q-item>
</template>

<script>
export default {
    props: {
        title: String,
    }
}
</script>

<style scoped>
.title {
    font-weight: 300;
    font-size: 30px;
    color: #282828;
}
</style>
