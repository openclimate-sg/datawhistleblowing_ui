<template>
 <div class='withdraw-info'>
     <h1 align="center"><strong>blow whistle</strong></h1>
     <b-container fluid v-if="!isHidden">
        <b-row class="my-1">
            <b-col sm="2">
            <label for="input-small">pubkey_x:</label><br/>
            <label for="input-small">pubkey_y:</label><br/>
            <label for="input-small">trapdoor:</label><br/>
            <label for="input-small">nullifier:</label><br/>
			<label for="input-small">privkey:</label><br/>
            <label for="input-small">dataHash:</label><br/>
            <label for="input-small">recipient:</label><br/>
            </b-col>
            <b-col sm="10">
            <b-form-input id="input-small" v-model="pubkey_x" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="pubkey_y" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="trapdoor" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="nullifier" size="sm"></b-form-input>
			<b-form-input id="input-small" v-model="privkey" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="data_hash" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="recipient" size="sm"></b-form-input>
            </b-col>
        </b-row>
    </b-container>
     {{ p }}
    
    <div class="withdraw-button" v-if="!isHidden" >
        <h5 v-on:click = "clickWithdraw"><strong> submit to contract</strong></h5>
     </div>

    <div class="tx" v-if="withdrawTx" align = "left">
        <strong>Tx hash:</strong> <a :href ="'https://kovan.etherscan.io/tx/' + withdrawTx" target="_blank" style="color:#4682b4">{{ withdrawTx }}</a>
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
    .withdraw-info {
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
    .withdraw-info:hover{
        background-color:#a8a857;
        color:#444444;
        box-shadow:0px 0px #a8a857;
    }
    .withdraw-button {
        padding: 10px;
        /* display: inline-block; */
        text-align:center;
        border: 1px solid black;
        height: 50px;
        width: 300px;
        margin: 20px auto;
        background-color:#999966;
    }
    .withdraw-button:hover{
        background-color:#6b6b47;
        color:#444444;
        box-shadow:0px 0px #6b6b47;
    }
    .withdraw-button:active{
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
    var websnark = require('@/util/libraries/websnark.js')
    var whistleHelper = require('@/util/helpers/whistleHelper.js')
	const axios = require('axios')
	const provingKeyURL = "https://oneofus.blob.core.windows.net/snarks/proving_key.bin"
	const circuitURL = "https://oneofus.blob.core.windows.net/snarks/circuit.json"

    export default {
        name: 'Whistleblow',
        mounted () {
            // console.log('dispatching getContractInstance')
            this.$store.dispatch('getContractInstance')
        },
        data () {
            return {
                isHidden: false,
                pendingTx: false,
                pendingSign: false,
                pendingEvent: false,
                withdrawEvent: null,
                withdrawTx: null,
                pubkey_x: localStorage.getItem('pubkey').split(',')[0],
                pubkey_y: localStorage.getItem('pubkey').split(',')[1],
                nullifier: localStorage.getItem('identityNullifier'),
				trapdoor: localStorage.getItem('identityTrapdoor'),
				privkey: localStorage.getItem('privkey'),
                data_hash: "",
                recipient: "",
				// circuit: null,
                // provingKey: null,
                p: null
            }	
        },

        methods: {
            async loadProvingKey () {
                const response = await fetch(provingKeyURL)
				const provingKey = new Uint8Array(await response.arrayBuffer());
				return provingKey
            },
            async loadCircuit () {
                const response = await fetch(circuitURL, {cache: 'no-store'})
				return response.json();

            },

            async clickWithdraw () {
				var provingKey = await this.loadProvingKey()
				var circuit = await this.loadCircuit()
				var leaves = await this.$store.state.contractInstance().methods.getIdentityCommitments().call()
				await console.log('leaves', leaves)
				const identity = await whistleHelper.formatIdentity(this.pubkey_x, this.pubkey_y, this.privkey, this.nullifier, this.trapdoor)
				await console.log('identity', identity)
				var inputs = await whistleHelper.blowWhistle(
					leaves,
					circuit,
					provingKey,
					identity,
					this.data_hash
				)

				await console.log('signal, a, b, c, input', inputs)

                await this.$store.state.contractInstance().methods.blowWhistle(
					this.recipient,
					inputs[0], inputs[1], inputs[2], inputs[3], inputs[4]
					).send(
                    {
                        // gas: 300000,
                        from: this.$store.state.web3.coinbase
                    }
                    )
            },


            toggleHidden (){
                this.isHidden = !this.isHidden
            },

            
        }
    }

</script>

