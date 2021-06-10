<template>
<span v-if="checkedinLocations.length">
    <q-item class="q-mt-sm">
        <q-item-section>
            <q-item-label caption class="subtitle">Checked-in at:</q-item-label>
        </q-item-section>
        <!-- <q-item-section side>
            <q-btn color="primary" text-color="white" rounded unelevated label="Check-out all" no-caps style="font-size:14px; font-weight: 400;" @click="checkOutAll" />
        </q-item-section> -->
    </q-item>
    <LocationList :locations="checkedinLocations" :hasMenu="false" icon="account_box" @button-event="viewPass" @main-event="checkOut">
    </LocationList>
</span>
</template>

<script>
import LocationList from "./locations/LocationList.vue";
import {
    mapGetters
} from "vuex";

export default {
    emits: ["check-out", "check-out-all", "view-pass"],
    components: {
        LocationList
    },
    methods: {
        checkOut(location, index) {
            this.$emit("check-out", location, index);
        },
        checkOutAll() {
            this.$emit("check-out-all");
        },
        viewPass(location) {
            this.$emit("view-pass", location);
        }
    },
    computed: {
        ...mapGetters(["checkedinLocations"])
    }
};
</script>

<style></style>
