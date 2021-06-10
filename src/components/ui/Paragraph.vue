<template>
<div class="q-my-md">
    <span v-if="expansion">
        <q-expansion-item :label="title" v-model="show" :duration="0" header-class="q-px-xs" fontSize="18">
            <div class="paragraph-text q-pl-xs q-pr-sm">
                <slot></slot>
            </div>
        </q-expansion-item>
    </span>
    <span v-else>
        <q-item-section>
            <span class="paragraph-title q-ml-xs">
                {{title}}
            </span>
        </q-item-section>
        <div class="paragraph-text q-mt-xs">
            <slot></slot>
        </div>
    </span>
</div>
</template>

<script>
export default {
    emits: ['close-others'],
    props: {
        title: String,
        expansion: Boolean,
        // triggerOpen: {
        //     type: Number,
        //     default: 0
        // },
        // triggerClose: {
        //     type: Number,
        //     default: 0
        // }
    },
    data() {
        return {
            show: false,
        }
    },
    watch: {
        // triggerOpen() {
        //     this.show = true
        // },
        // triggerClose() {
        //     this.show = false
        // },
        show(value) {
            // if (value == true) {
            //     this.$emit('close-others')
            // }
            if (value == true) {
                setTimeout(() => {
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 150)
            }
        }
    },
}
</script>

<style scoped>

</style>
