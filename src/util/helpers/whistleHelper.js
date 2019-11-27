/*

1. user fills in from_x, from_y, nonce, amount, token_type, txRoot, recipient
2. server gets position, proof
3. user signs M = hash([nonce, recipient]) 
    -> SNARK input.json is {Ax, Ay, R8x, R8y, S, M}
4. pass input.json to SNARK circuit, calculatewitness -> witness.json -> witness.bin
5. websnark generates proof (a, b, c) using witness.bin and (existing) proving_key.bin
6. send withdraw([from_x, from_y], [nonce, amount, token_type], [position, proof], 
    txRoot, recipient, a, b, c)

*/

const snarkjs = require("snarkjs");
const eddsa = require("@/circomlib/src/eddsa.js");
const mimcjs = require("@/circomlib/src/mimc7.js");
const bigInt = snarkjs.bigInt;
const buildWitness = require("../libraries/buildwitness")
const {unstringifyBigInts} = require("../libraries/stringifybigint.js");
const libsemaphore = require('libsemaphore')


module.exports = {

	formatIdentity: function(pubkey_x, pubkey_y, privKey, identityNullifier, identityTrapdoor){
		return {
			"keypair": {
				"pubKey": [bigInt(pubkey_x), bigInt(pubkey_y)],
				"privKey": Buffer.from(privKey)
			},
			"identityNullifier": bigInt(identityNullifier),
			"identityTrapdoor": bigInt(identityTrapdoor)
		}
	},

	blowWhistle: async function(leaves, circuit, provingKey, identity, externalNullifier){
		const semaphoreTreeDepth = 12
		const signal = ''
		var parsedCircuit = libsemaphore.genCircuit(circuit)

		const result = await libsemaphore.genWitness(
			signal,
			parsedCircuit,
			identity,
			leaves,
			semaphoreTreeDepth,
			externalNullifier,
		)
	    let witness = result.witness
		console.log('Generating zk-SNARK proof that the witness is part of the set of executives, but which does not reveal their identity...')
		const proof = await libsemaphore.genProof(witness, provingKey)
		const publicSignals = libsemaphore.genPublicSignals(witness, circuit)
		// const isValid = verifyProof(verifyingKey, proof, publicSignals)
		const formatted = libsemaphore.formatForVerifierContract(proof, publicSignals)

		return ethers.utils.toUtf8Bytes(signal),
		formatted.a,
		formatted.b,
		formatted.c,
		formatted.input
	}

}

