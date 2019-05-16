const address = '0x4E9622F9FaD04e16434FbedA56e15A353684CD89'
const ABI = [{"constant":true,"inputs":[{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"},{"name":"input","type":"uint256[3]"}],"name":"verifyProof","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pubkey_from","type":"uint256[2]"},{"name":"amount","type":"uint256"},{"name":"token_type_from","type":"uint256"},{"name":"proof","type":"uint256[2]"},{"name":"position","type":"uint256[2]"},{"name":"txRoot","type":"uint256"},{"name":"recipient","type":"address"},{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mimc","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"mimcMerkle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"},{"name":"input","type":"uint256[3]"}],"name":"updateState","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_mimcContractAddr","type":"address"},{"name":"_mimcMerkleContractAddr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"token_type","type":"uint256"},{"indexed":false,"name":"from","type":"uint256[2]"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"txRoot","type":"uint256"}],"name":"Withdraw","type":"event"}]
export {address, ABI}