<template>
    <div>
        <Metamask/><br/>
        <EdDSA/><br/>
        <Register/><br/>
        <Report/><br/>
        <Whistleblow/><br/><br/>
    </div>

</template>

<script>
    import Metamask from '@/components/Metamask'
    import Register from '@/components/Register'
    import Report from '@/components/Report'
    import Whistleblow from '@/components/Whistleblow'
    import EdDSA from '@/components/EdDSA'
    export default {
        name: 'RollupNC',
        beforeCreate () {
            // console.log('registerWeb3 Action dispatched from RollupNC.vue')
            this.$store.dispatch('registerWeb3')
        },
        components: {
            'Metamask': Metamask,
            'EdDSA': EdDSA,
            'Register': Register,
            'Report': Report,
            'Whistleblow': Whistleblow
        }
    }
</script>

<style scoped>
</style>