<template>
<q-card style="width:90%">
    <q-card-section style="padding-bottom:0px; padding-left: 16px">
        <div class="text-h6">Venue name:</div>
    </q-card-section>
    <q-card-section style="padding-top:0px; padding-bottom:0px" class="q-pt-none">
        <q-input dense v-model="locationNameField" clearable clear-icon="close" ref="inputRef" type="textarea" autogrow />
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Reset" @click="resetLocationName" />
        <q-btn flat label="Cancel" @click="closeDialog" />
        <q-btn flat label="Save" @click="saveLocationName" />
    </q-card-actions>
</q-card>
</template>

<script>
import {
    mapActions
} from 'vuex'

export default {
    props: {
        location: Object,
        index: Number,
    },
    emits: ['close-rename-dialog', 'open-alert'],
    data() {
        return {
            locationNameField: '',
        }
    },
    methods: {
        ...mapActions(['locationsTitleEditAction']),
        async saveLocationName() {
            let locationTemp = this.location
            locationTemp.title = this.locationNameField
            await this.locationsTitleEditAction({
                location: locationTemp,
                index: this.index
            })
            this.$emit('open-alert', 'Location renamed')
            this.closeDialog()
        },
        resetLocationName() {
            this.locationNameField = this.location.name
            this.saveLocationName()
        },
        closeDialog() {
            this.$emit('close-rename-dialog')
        }
    },
    created() {
        this.locationNameField = this.location.title
    }
}
</script>

<style>

</style>
