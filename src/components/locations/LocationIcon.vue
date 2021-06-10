<template>
<q-card style="width: 280px">
    <q-card-section style="padding-bottom:0px; padding-left: 16px">
        <div class="text-h6">Select Icon:</div>
    </q-card-section>
    <div class="column" style="height: 200px; padding: 0px 5px">
        <div class="col-4" v-for="(icon, index) in shownIcons" :key="index">
            <q-btn flat :color="icon == location.icon ? 'primary' : 'list'" round :icon="icon" style="font-size:1.1rem; padding:17px;" padding="none" @click="selectIcon(icon)" />
        </div>
    </div>
    <div class="flex flex-center" style="padding-bottom: 20px; padding-top:10px">
        <q-pagination v-model="currentPage" :max="5" size="16px">
        </q-pagination>
    </div>
</q-card>
</template>

<script>
import {
    mapActions
} from "vuex";

export default {
    props: {
        location: Object,
        index: Number
    },
    emits: ["close-icon-dialog",'open-alert'],
    data() {
        return {
            currentPage: 1,
            icons: [
                "place",
                'school',
                "directions_subway",
                "restaurant",
                'local_cafe',
                "flight",
                "local_grocery_store",
                "store_mall_directory",
                "fastfood",
                "local_gas_station",
                "local_hospital",
                "local_mall",
                "wine_bar",
                "local_post_office",
                "local_hotel",
                "local_see",
                "directions_bus",
                'local_bar',
                'local_parking',
                'local_offer',
                'atm',
                'beach_access',
                'local_phone',
                'fitness_center',
                'pool',
                'spa',
                'ice_skating',
                'kayaking',
                'self_improvement',
                'sports_basketball',
                'sports_soccer',
                'sports_tennis',
                'sports_volleyball',
                'directions_bike',
                'golf_course',
                'handyman',
                'sports_bar',
                "local_library",
                "local_florist",
                'smoking_rooms',
                "payments",
                'local_pizza',
                'local_activity',
                'directions_boat',
                'add_business',
                'cleaning_services',
                'design_services',
                'ev_station',
                'menu_book',
                'local_laundry_service',
                'local_printshop',
                'apartment',
                'business_center',
                'casino',
                'checkroom',
                'child_care',
                'child_friendly',
                'corporate_fare',
                'house',
                'print',
            ],
        };
    },
    methods: {
        ...mapActions(["locationsIconEditAction"]),
        async selectIcon(icon) {
            let locationTemp = this.location;
            locationTemp.icon = icon;
            await this.locationsIconEditAction({
                location: locationTemp,
                index: this.index
            });
            this.$emit('open-alert', 'Icon changed')
            this.closeDialog();
        },
        closeDialog() {
            this.$emit("close-icon-dialog");
        }
    },
    computed: {
        shownIcons() {
            const pageX12 = this.currentPage * 12
            return this.icons.slice(pageX12 - 12, pageX12);
        }
    },
    created() {
        this.locationNameField = this.location.title;
    }
};
</script>

<style></style>
