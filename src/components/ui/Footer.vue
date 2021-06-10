<template>
<q-footer class="footer-class">
    <div class="row footer-style">
        <FooterItem label="Scan" iconName="qr_code" class="col footer-link q-pb-xs q-pt-sm relative-position" @click-event="$router.push('/scan')" />
        <FooterItem label="Check-out" iconName="exit_to_app" class="col footer-link q-pb-xs q-pt-sm relative-position" @click-event="checkOutAll" />
        <FooterItem label="Profile" iconName="person_outline" class="col footer-link q-pb-xs q-pt-sm relative-position" @click-event="$router.push('/profile')" />
        <FooterItem label="Help" iconName="help_outline" class="col footer-link q-pb-xs q-pt-sm relative-position" @click-event="$router.push('/tutorial')" />
    </div>
</q-footer>
</template>

<script>
import FooterItem from './FooterItem.vue'
export default {
    emits: ['check-out-all'],
    components: {
        FooterItem
    },
    methods: {
        checkOutAll() {
            if (this.$store.getters.checkedinLocations.length) {
                this.$emit("check-out-all");
            }
        },
    }

}
</script>

<style>

</style>
