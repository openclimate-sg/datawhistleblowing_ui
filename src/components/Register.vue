<template>
 <div class='register-info'>
     <h1 align="center"><strong>register executive</strong></h1>
     <b-container fluid v-if="!isHidden">
        <b-row class="my-1">
            <b-col sm="2">
            <label for="input-small">pubkey_x:</label><br/>
            <label for="input-small">pubkey_y:</label><br/>
            <label for="input-small">nullifier:</label><br/>
            <label for="input-small">trapdoor:</label><br/>
            </b-col>
            <b-col sm="10">
            <b-form-input id="input-small" v-model="pubkey_x" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="pubkey_y" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="identityNullifier" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="identityTrapdoor" size="sm"></b-form-input>
            </b-col>
        </b-row>
    </b-container>
     <div class="register-button" v-if="!isHidden" >
        <h5 v-on:click = "clickRegister()"><strong>submit to contract</strong></h5>
     </div>
    <div class="tx" v-if="registerTx" align = "left">
        <strong>tx hash:</strong> <a :href ="'https://kovan.etherscan.io/tx/' + registerTx" target="_blank" style="color:#4682b4">{{ registerTx }}</a>
    </div>
    <div v-if="registerEvent" align="left">
        <strong>pubkey_x:</strong> {{ registerEvent.pubkey_x }} <br/>
		<strong>pubkey_y:</strong> {{ registerEvent.pubkey_y }} <br/>
        <strong>identityNullifier:</strong> {{ registerEvent.identityNullifier }} <br/>
        <strong>identityTrapdoor:</strong> {{ registerEvent.identityTrapdoor }}
    </div>
 </div>
</template>

<style scoped>
    .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    }
    .register-info {
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        padding: 10px;
        /* display: inline-block; */
        text-align:left;
        border: 1px solid black;
        background-color:#c3c388; 
        width: 70%;
        /* padding-left: 10%;  */
        white-space: wrap;
        /* width: 100%;                   IE6 needs any width */
        overflow: hidden;              /* "overflow" value must be different from  visible"*/ 
        -o-text-overflow: ellipsis;    /* Opera < 11*/
        text-overflow:    ellipsis; 
		font-size: 90%
    }
    .register-info:hover{
        background-color:#a8a857;
        color:#444444;
        box-shadow:0px 0px #a8a857;
    }
    .register-button {
        padding: 10px;
        /* display: inline-block; */
        text-align:center;
        border: 1px solid black;
        height: 50px;
        width: 300px;
        margin: 20px auto;
        background-color:#999966;
    }
    .register-button:hover{
        background-color:#6b6b47;
        color:#444444;
        box-shadow:0px 0px #6b6b47;
    }
    .register-button:active{
        opacity: 0.7;
    }
    #loader {
        width:150px;
    }
    *{
        color: #444444;
    }
</style>


<script>
    var getAccount = require('@/util/getters/getAccount.js')

    export default {
        name: 'Register',
        mounted () {
            // console.log('dispatching getContractInstance')
            this.$store.dispatch('getContractInstance')
        },
        data () {
            return {
                isHidden: false,
                pendingTx: false,
                pendingEvent: false,
                registerEvent: null,
                registerTx: null,
				pubkey_x: "",
				pubkey_y: "",
				identityNullifier: "",
				identityTrapdoor: ""
            }
        },

        methods: {
            clickRegister ()  {
                this.registerTx = null
                this.registerEvent = null
                this.pendingEvent = true
                this.pendingTx = true

				var idc = '0x0' + getAccount.generateIdentityCommitment(
					this.pubkey_x, this.pubkey_y, this.identityNullifier, this.identityTrapdoor
				)

                this.$store.state.contractInstance().methods.insertIdentity(
                    idc).send(
                    {
                        // gas: 300000,
                        from: this.$store.state.web3.coinbase,
                    }, 
				)
            },

            toggleHidden (){
                this.isHidden = !this.isHidden
            }
        }
    }

</script>

