const axios = require('axios')
const {server} = require('../constants/server')
const eddsa = require("@/circomlib/src/eddsa.js");
const mimcjs = require("@/circomlib/src/mimc7.js");
const ethers = require('ethers')

module.exports = {

	genExternalNullifier: function(plaintext){

		const cutOrExpandHexToBytes = (hexStr, bytes) => {
			const len = bytes * 2
		
			const h = hexStr.slice(2, len + 2)
			return '0x' + h.padStart(len, '0')
		}
		const hashed = ethers.utils.solidityKeccak256(['string'], [plaintext])
		return cutOrExpandHexToBytes(
			'0x' + hashed.slice(8),
			32,
		)
	}

}
