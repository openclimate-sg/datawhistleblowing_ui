<template>
  <div class="eddsa-info" align="left">
        <strong>identity: </strong> <br/>
        pubkey_x: {{ pubkey.split(',')[0] }} <br/>
        pubkey_y: {{ pubkey.split(',')[1] }} <br/>
		identityTrapdoor: {{ identityTrapdoor }} <br/>
		identityNullifier: {{ identityNullifier }} <br/><br/>
        <button @click="newWallet">generate identity</button>
        <button v-on:click="showPrivkey">show EdDSA private key</button>        

    </div>
    
</template>

<style scoped>
.eddsa-info {
  width: 100%;
  padding-left: 20%; 
  /* margin-left: -300px; */
  white-space: wrap;
  /* width: 100%;                   IE6 needs any width */
  /* overflow: hidden;              /* "overflow" value must be different from  visible"*/ 
  /* -o-text-overflow: ellipsis;    Opera < 11 */
  /* text-overflow:    ellipsis;   */
}
</style>

<script>
    var getAccount = require('@/util/getters/getAccount.js')
    export default{
        name: 'EdDSA',
        data () {
          return {
            pubkey: '',
			privkey: '',
			identityNullifier: '',
			identityTrapdoor: ''
          }
        },
        mounted () {
          if (localStorage.getItem('pubkey')) {
            this.pubkey = localStorage.getItem('pubkey')
			this.privkey = localStorage.getItem('privkey')
			this.identityNullifier = localStorage.getItem('identityNullifier')
            this.identityTrapdoor = localStorage.getItem('identityTrapdoor')
          }
        },
        methods: {
          newWallet() {
            this.privkey = getAccount.generatePrvKey()
            console.log(this.privkey)
			this.pubkey = getAccount.generatePubKey(this.privkey).toString()
			this.identityNullifier = getAccount.generateIdentityNullifier()
			this.identityTrapdoor = getAccount.generateIdentityTrapdoor()
            localStorage.setItem('privkey', this.privkey)
			localStorage.setItem('pubkey', this.pubkey.toString())
			localStorage.setItem('identityNullifier', this.identityNullifier)
			localStorage.setItem('identityTrapdoor', this.identityTrapdoor)
          },
          showPrivkey() {
            alert(localStorage.privkey)
          }
        }
    }
</script>
