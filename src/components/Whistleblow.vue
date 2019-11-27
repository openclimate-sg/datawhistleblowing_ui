<template>
 <div class='withdraw-info' v-on:click="toggleHidden">
     <h1 align="center"><strong>blow whistle</strong></h1>
     <b-container fluid v-if="!isHidden" v-on:click="toggleHidden">
        <b-row class="my-1">
            <b-col sm="2">
            <label for="input-small">from_x:</label><br/>
            <label for="input-small">from_y:</label><br/>
            <label for="input-small">nonce:</label><br/>
            <label for="input-small">amount:</label><br/>
            <label for="input-small">token:</label><br/>
            <label for="input-small">recipient:</label><br/>
            <label for="input-small">txRoot:</label><br/>
            </b-col>
            <b-col sm="10">
            <b-form-input id="input-small" v-model="from_x" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="from_y" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="nonce" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="amount" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="token_type_from" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="recipient" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="txRoot" size="sm"></b-form-input>
            </b-col>
        </b-row>
    </b-container>
    <div class="withdraw-button" v-if="!isHidden" v-on:click="toggleHidden">
        <h5 v-on:click = "getMerkleProof"><strong>1. Get Merkle proof</strong></h5>
     </div>
     <div class="withdraw-button" v-if="!isHidden" v-on:click="toggleHidden">
        <h5 v-on:click = "getSnarkProof"><strong>2. EdDSA sign</strong></h5>
     </div>
     {{ p }}
    <b-container fluid v-if="!isHidden" v-on:click="toggleHidden">
        <b-row class="my-1">
            <b-col sm="2">
            <label for="input-small">a:</label><br/>
            <label for="input-small">b:</label><br/>
            <label for="input-small">c:</label><br/>
            </b-col>
            <b-col sm="10">
            <b-form-input id="input-small" placeholder="calculating..." v-model="a"  size="sm"></b-form-input>
            <b-form-input id="input-small" placeholder="calculating..." v-model="b" size="sm"></b-form-input>
            <b-form-input id="input-small" placeholder="calculating..." v-model="c" size="sm"></b-form-input>
            </b-col>
        </b-row>
    </b-container>
    <div class="withdraw-button" v-if="!isHidden" v-on:click="toggleHidden">
        <h5 v-on:click = "clickWithdraw"><strong>3. Submit to contract</strong></h5>
     </div>

    <div class="tx" v-if="withdrawTx" align = "left">
        <strong>Tx hash:</strong> <a :href ="'https://kovan.etherscan.io/tx/' + withdrawTx" target="_blank" style="color:#4682b4">{{ withdrawTx }}</a>
    </div>
    <div v-if="withdrawEvent" align="left">
        <strong>From (EdDSA):</strong> {{ withdrawEvent.from[0] }}, {{ withdrawEvent.from[1] }} <br/>
        <strong>To (Ethereum):</strong> {{ withdrawEvent.recipient }} <br/>
        <strong>Amount:</strong> {{ withdrawEvent.amount }} <br/>
        <strong>Token type:</strong> {{ withdrawEvent.token_type }}
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
    // const circuit = require('@/util/constants/circuit.json')
    const axios = require('axios')

    export default {
        name: 'Whistleblow',
        mounted () {
            // console.log('dispatching getContractInstance')
            this.$store.dispatch('getContractInstance')
            this.loadProvingKey()
            // this.loadWitness()
        },
        data () {
            return {
                isHidden: true,
                pendingTx: false,
                pendingSign: false,
                pendingEvent: false,
                withdrawEvent: null,
                withdrawTx: null,
                from_x: "5188413625993601883297433934250988745151922355819390722918528461123462745458",
                from_y: "12688531930957923993246507021135702202363596171614725698211865710242486568828",
                nonce: 0,
                amount: 500,
                token_type_from: 10,
                proof: [
                    "8342813455761320245860753246541064453130959347426759535493956280345855081934",
                    "13262889801219401015313652374233039919049275140584211861348878621716455310933"
                ],
                position: [1, 0],
                txRoot: "149126198147162084281232535967801344773039936115368629187002798446712412021",
                recipient: "0xC33Bdb8051D6d2002c0D80A1Dd23A1c9d9FC26E4",
                a: null,
                b: null,
                c: null,
                
                provingKey: null,
                witness: null,
                privkey: Buffer.from("2".padStart(64,'0'), "hex"),
                // privkey: localStorage.getItem('privkey'),
                p: null
            }
        },

        methods: {
            loadProvingKey () {
                fetch("http://raw.githubusercontent.com/therealyingtong/rollupnc_ui/master/src/assets/proving_key.bin")
                .then( (response) => {
                    return response.arrayBuffer();
                }).then( (b) => {
                    this.provingKey = b;
                })
            },

            getSnarkProof ()  {
                this.withdrawTx = null
                this.withdrawEvent = null
                this.pendingEvent = true
                this.pendingTx = false
                this.pendingSign = true

                // console.log('inputs to whistleHelper',
                // this.nonce, this.recipient, [this.from_x, this.from_y], this.privkey)
                // var snarkInputs = whistleHelper.signWithdrawMessage(
                //     this.nonce, this.recipient, [this.from_x, this.from_y], this.privkey
                // )
                // this.witness = whistleHelper.calculateWitness(circuit, snarkInputs)
                // window.genZKSnarkProof(this.witness, this.provingKey).then((p)=> {
                //     this.p = p
                //     console.log(p)
                //     var call = whistleHelper.generateCall(p)
                //     console.log("call", call)
                //     this.a = call.a
                //     this.b = call.b
                //     this.c = call.c                
                // })
            },

            clickWithdraw () {
                this.pendingTx = true
                this.$store.state.contractInstance().methods.withdraw(
                    [this.from_x, this.from_y], 
                    [this.nonce, this.amount, this.token_type_from], 
                    [this.position, this.proof], this.txRoot, this.recipient,
                    this.a, this.b, this.c).send(
                    {
                        // gas: 300000,
                        from: this.$store.state.web3.coinbase
                    }, 
                    (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            this.pendingTx = false
                            this.withdrawTx = result
                            this.$store.state.contractInstance().events.Withdraw( 
                                {fromBlock: 0, toBlock: 'latest'}, (error, event) => {}
                            )
                            .on('data', (event) => {
                                this.withdrawEvent = event['returnValues']
                                console.log(this.withdrawEvent)
                                this.pendingEvent = true
                            })
                            .on('error', console.error)
                        }
                    })
            },

            getMerkleProof () {

            },

            toggleHidden (){
                this.isHidden = !this.isHidden
            },

            
        }
    }

</script>

