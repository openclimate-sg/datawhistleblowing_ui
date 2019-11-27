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
const ethers = require('ethers')


module.exports = {

	formatIdentity: function(pubkey_x, pubkey_y, privKey, identityNullifier, identityTrapdoor){
		return {
			keypair: {
				pubKey: [BigInt(pubkey_x), BigInt(pubkey_y)],
				privKey: Buffer.from(privKey, 'hex')
			},
			identityNullifier: BigInt(identityNullifier),
			identityTrapdoor: BigInt(identityTrapdoor)
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
			bigInt(externalNullifier),
		)
	    let witness = result.witness
		console.log('Generating zk-SNARK proof that the witness is part of the set of executives, but which does not reveal their identity...')
		console.log('provingKey',provingKey)
		const proof = await libsemaphore.genProof(witness, provingKey)
		const publicSignals = await libsemaphore.genPublicSignals(witness, circuit)
		// const isValid = verifyProof(verifyingKey, proof, publicSignals)
		const formatted = await libsemaphore.formatForVerifierContract(proof, publicSignals)

		console.log(formatted, signal)

		return [ethers.utils.toUtf8Bytes(signal),
		formatted.a,
		formatted.b,
		formatted.c,
		formatted.input]
	}

}

