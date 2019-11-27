<template>
  <div class="eddsa-info" align="left">
        <strong>identity: </strong> <br/><br/>
        pubkey_x: <br/> {{ pubkey.toString().split(',')[0] }} <br/>
        pubkey_y: <br/> {{ pubkey.toString().split(',')[1] }} <br/>
		trapdoor: <br/> {{ identityTrapdoor }} <br/>
		nullifier: <br/> {{ identityNullifier }} <br/><br/>
        <button @click="newWallet">generate identity</button>
        <button v-on:click="showPrivkey">show private key</button>        

    </div>
    
</template>

<style scoped>
.eddsa-info {
  width: 100%;
  padding-left: 15%; 
  /* margin-left: -300px; */
  white-space: wrap;
  /* overflow: hidden;              /* "overflow" value must be different from  visible"*/ 
  /* -o-text-overflow: ellipsis;    Opera < 11 */
  text-overflow:    ellipsis;
  font-size: 79%  
}
</style>

<script>
    var getAccount = require('@/util/getters/getAccount.js')
    export default{
        name: 'EdDSA',
        data () {
          return {
			identity: {},
            pubkey: '',
			privkey: '',
			identityNullifier: '',
			identityTrapdoor: ''
          }
        },
        mounted () {
          if (localStorage.getItem('pubkey')) {
			this.identity = localStorage.getItem('identity')
            this.pubkey = localStorage.getItem('pubkey')
			this.privkey = localStorage.getItem('privkey')
			this.identityNullifier = localStorage.getItem('identityNullifier')
            this.identityTrapdoor = localStorage.getItem('identityTrapdoor')
          }
        },
        methods: {
          newWallet() {
			this.identity = getAccount.generateIdentity()
			console.log('identity', this.identity)
			this.pubkey = this.identity['keypair']['pubKey']
			this.privkey = this.identity['keypair']['privKey'].toString('hex')
			this.identityNullifier = this.identity['identityNullifier']
			this.identityTrapdoor = this.identity['identityTrapdoor']
			localStorage.setItem('identity', this.identity)
			localStorage.setItem('privkey', this.privkey)
			localStorage.setItem('pubkey', this.pubkey)
			localStorage.setItem('identityNullifier', this.identityNullifier)
			localStorage.setItem('identityTrapdoor', this.identityTrapdoor)
          },
          showPrivkey() {
            alert(localStorage.privkey)
          }
        }
    }
</script>
