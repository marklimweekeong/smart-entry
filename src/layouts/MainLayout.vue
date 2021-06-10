<template>
<q-layout view="lHh Lpr lFf">
    <q-header elevated>
        <q-toolbar>
            <q-toolbar-title>
                SmartEntry
            </q-toolbar-title>
            <div class="q-gutter-sm">
                <q-btn flat class="text-white" round icon="sort" style="font-size:1rem" padding="none" />
                <q-btn flat class="text-white" round icon="more_vert" style="font-size:0.9rem" padding="none" />
            </div>
        </q-toolbar>
    </q-header>

    <q-page-container>
        <router-view />
    </q-page-container>
</q-layout>
</template>

<script>
export default {
    name: 'MainLayout',
    data() {
        return {}
    }
}
</script>
