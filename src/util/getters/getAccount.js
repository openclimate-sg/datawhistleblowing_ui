const eddsa = require("../../circomlib/src/eddsa.js");
const snarkjs = require("snarkjs");
var crypto = require("crypto");
var circomlib = require("../../circomlib");
const libsemaphore = require('libsemaphore')

module.exports = {

	generateIdentity: function(){
		return libsemaphore.genIdentity()
	},


	generateIdentityCommitment: function(
		pubkey_x, pubkey_y, identityNullifier, identityTrapdoor
	){
		var pedersenHash = function (ints) {
			var p = circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(Buffer.concat(ints.map(function (x) { return x.leInt2Buff(32); }))));
			return snarkjs.bigInt(p[0]);
		};
		return pedersenHash([
			circomlib.babyJub.mulPointEscalar(
				[snarkjs.bigInt(pubkey_x), snarkjs.bigInt(pubkey_y)], 8)[0],
			snarkjs.bigInt(identityNullifier),
			snarkjs.bigInt(identityTrapdoor),
		]).toString(16);
	}

}
