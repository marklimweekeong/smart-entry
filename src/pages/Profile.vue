<template>
<transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-layout view="hHh lpR fFf" style="background-color: white">
        <Header title="Profile">
            <template #front>
                <q-btn class="q-px-xs" flat color="list" round icon="arrow_back" style="font-size:1rem" padding="none" @click="$router.push('/')" />
            </template>
        </Header>
        <q-page-container class="q-mx-md">
            <!-- <DetailsForm @see-data-policy="seeDataPolicy(false)" /> -->
            <DetailsForm />
            <Declaration />
            <FAQ />
            <!-- <FAQ :triggerOpen="FAQTriggerOpen" :triggerClose="FAQTriggerClose" @close-others="closeAllButFAQ" /> -->
            <!-- <Privacy :triggerOpen="dataPolicyTriggerOpen" :triggerClose="dataPolicyTriggerClose" @close-others="closeAllButData" /> -->
        </q-page-container>
    </q-layout>
</transition>
</template>

<script>
import Header from "../components/ui/Header.vue";
import Declaration from "../components/profile/Declaration.vue";
import FAQ from "../components/profile/FAQ.vue";
// import Privacy from "../components/profile/Privacy.vue";
import DetailsForm from "../components/profile/DetailsForm.vue";

export default {
    components: {
        Header,
        Declaration,
        FAQ,
        // Privacy,
        DetailsForm
    },
    data() {
        return {
            // dataPolicyTriggerOpen: 0,
            // dataPolicyTriggerClose: 0,
            // FAQTriggerOpen: 0,
            // FAQTriggerClose: 0,
        }
    },
    methods: {
        // seeDataPolicy() {
        //     this.dataPolicyTriggerClose++
        //     this.FAQTriggerClose++
        //     setTimeout(() => {
        //         this.dataPolicyTriggerOpen++
        //     }, 3)
        // },
        // closeAllButFAQ() {
        //     this.dataPolicyTriggerClose++
        // },
        // closeAllButData() {
        //     this.FAQTriggerClose++
        // },
    },
    beforeRouteLeave(to, from, next) {
        if (!this.$store.getters.userId) {
            alert('Fill in your personal information to continue, your personal information is only used for automatic SafeEntry check-in. View our data policy here.')
            next(false)
        } else {
            next()
        }
    },
};
</script>

<style></style>
