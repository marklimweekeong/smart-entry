<template>
<span>
    <q-item class="q-mt-sm">
        <q-item-section>
            <q-item-label caption class="subtitle">
                <span v-if="$store.getters.locations.length">Nearby saved venues:</span>
                <span v-else>Scan QR Code to check-in</span>
            </q-item-label>
        </q-item-section>
        <!-- <q-item-section side>
            <q-btn color="primary" text-color="white" round unelevated icon="qr_code" no-caps style="font-size:18px; font-weight: 400" @click="scanQRCode" />
        </q-item-section> -->
    </q-item>
    <LocationList :locations="tenLocations" icon="edit" :hasMenu="true" @main-event="checkIn" @check-in="checkIn" @rename="rename" @change-icon="changeIcon" @delete-alert="openAlert('Location deleted')">
    </LocationList>
    <q-dialog v-model="isRenameDialogOpen">
        <LocationRename :location="locationToEdit" :index="locationToEditIndex" @close-rename-dialog="closeRenameDialog" @open-alert="openAlert" />
    </q-dialog>
    <q-dialog v-model="isIconDialogOpen">
        <LocationIcon :location="locationToEdit" :index="locationToEditIndex" @close-icon-dialog="closeIconDialog" @open-alert="openAlert" />
    </q-dialog>
</span>
</template>

<script>
import LocationList from "./locations/LocationList.vue";

export default {
    emits: ["check-in", "open-alert"],
    components: {
        LocationList,
        LocationRename: () => import("./locations/LocationRename.vue"),
        LocationIcon: () => import("./locations/LocationIcon.vue")
    },
    data() {
        return {
            locationToEdit: null,
            locationToEditIndex: null,
            isRenameDialogOpen: false,
            isIconDialogOpen: false
        };
    },
    methods: {
        checkIn(location, index) {
            this.$emit("check-in", location, index);
        },
        scanQRCode() {
            this.$router.push("/scan");
        },
        rename(location, index) {
            this.locationToEdit = location;
            this.locationToEditIndex = index;
            this.isRenameDialogOpen = true;
        },
        closeRenameDialog() {
            this.isRenameDialogOpen = false;
        },
        changeIcon(location, index) {
            this.locationToEdit = location;
            this.locationToEditIndex = index;
            this.isIconDialogOpen = true;
        },
        closeIconDialog() {
            this.isIconDialogOpen = false;
        },
        openAlert(str) {
            this.$emit("open-alert", str);
        },
    },
    computed: {
        tenLocations() {
            return this.$store.getters.locations.slice(0, 10);
        }
    },
    watch: {
        isIconDialogOpen(value) {
            if (!value) {
                this.locationToEdit = null;
                this.locationToEditIndex = null;
            }
        },
        isRenameDialogOpen(value) {
            if (!value) {
                this.locationToEdit = null;
                this.locationToEditIndex = null;
            }
        }
    }
};
</script>

<style></style>
