<template>
<q-list class="rounded-borders">
    <div v-for="(location, index) in locations" :key="index">
        <div style="padding: 0px 20px;">
            <LocationItem :location="location" :index="index" :icon="icon" @main-event="mainEvent" @button-event="buttonEvent">
                <q-menu v-if="hasMenu">
                    <q-list style="min-width: 150px">
                        <q-item clickable v-close-popup @click="checkin(location, index)">
                            <q-item-section>Check-in</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="rename(location, index)">
                            <q-item-section>Rename</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="changeIcon(location, index)">
                            <q-item-section>Change Icon</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="deleteLocation(index)">
                            <q-item-section>Delete</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </LocationItem>
        </div>
    </div>
</q-list>
</template>

<script>
import {
    mapActions
} from "vuex";
import LocationItem from "./LocationItem.vue";
export default {
    emits: ["main-event", "button-event", "check-in", "rename", "change-icon", 'delete-alert'],
    components: {
        LocationItem
    },
    props: {
        locations: Array,
        icon: String,
        hasMenu: Boolean
    },
    data() {
        return {};
    },
    methods: {
        ...mapActions(["locationsEditAction"]),
        mainEvent(location, index) {
            this.$emit("main-event", location, index);
        },
        buttonEvent(location, index) {
            this.$emit("button-event", location, index);
        },
        deleteLocation(index) {
            this.$store.dispatch("locationsDeleteAction", index);
            this.$emit("delete-alert");
        },
        checkin(location, index) {
            this.$emit("check-in", location, index);
        },
        rename(location, index) {
            this.$emit("rename", location, index);
        },
        changeIcon(location, index) {
            this.$emit("change-icon", location, index);
        }
    }
};
</script>

<style></style>
