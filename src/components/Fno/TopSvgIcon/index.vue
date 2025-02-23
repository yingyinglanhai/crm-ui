<template>
    <div>
        <svg-icon :icon-class="iconClass" @click="goto"/>
    </div>
</template>

<script>
export default {
    name: 'TopSvgIcon',
    props: {
        iconClass: "",
        url: ""
    },
    data() {
        return {

        }
    },
    methods: {
        goto() {
            window.open(this.url)
        }
    }
}
</script>
