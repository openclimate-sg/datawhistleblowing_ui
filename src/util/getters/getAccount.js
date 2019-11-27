const eddsa = require("../../circomlib/src/eddsa.js");
const snarkjs = require("snarkjs");
var crypto = require("crypto");
var circomlib = require("../../circomlib");

module.exports = {
    
    generatePrvKey: function(){
        var seed = Math.random().toString().slice(2,66).padStart(64, '0');
        return seed;  
    },

    generatePubKey: function(seed){
        var prvKey = Buffer.from(seed.toString(), "hex");
        var pubKey = eddsa.prv2pub(prvKey);
        return pubKey; 
	},
	
	generateIdentityNullifier: function(){
		var genRandomBuffer = function (numBytes) {
			if (numBytes === void 0) { numBytes = 32; }
			return crypto.randomBytes(numBytes);
		};
		return snarkjs.bigInt.leBuff2int(genRandomBuffer(31))
	},

	generateIdentityTrapdoor: function(){
		var genRandomBuffer = function (numBytes) {
			if (numBytes === void 0) { numBytes = 32; }
			return crypto.randomBytes(numBytes);
		};
		return snarkjs.bigInt.leBuff2int(genRandomBuffer(31))
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
