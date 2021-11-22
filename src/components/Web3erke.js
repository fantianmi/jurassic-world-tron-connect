import erkeABI from '../config/abi/erke.json'

const contractAddress = 'TMA9ma43rvdEZHygpDResKuQfuE2iide23'
const contractABI = erkeABI
var contract = null;

function init(callback) {
	contract = window.tronWeb.contract(contractABI, contractAddress);
	return callback(contract)
}

async function transfer(recipient, amount, callback, errorCallBack) {
	const tronWeb = window.tronWeb;
	let instance = await tronWeb.contract().at(contractAddress);
	let res = await instance["transfer"](recipient, amount);

	res.send({
		feeLimit: 100000000,
		callValue: 0,
		shouldPollResponse: false
	}).then(
		res => {
			callback(res)
		},
		err => {
			errorCallBack(err)
		}
	);
}

export default {
	init,
	transfer
};