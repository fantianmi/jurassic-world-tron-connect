import juraABI from '../config/abi/jura.json'

const contractAddress = 'TAot61db2pKzdLqZ3FJDntTThUNVfdEi6z' //智能合约地址
const contractABI = juraABI //智能合约abi
var contract = null;

function init(callback) {
	contract = window.tronWeb.contract(contractABI, contractAddress);
	return callback(contract)
}

// 玩家激活参与支付750 USDT
async function transfer(recipient, amount, callback, errorCallBack) {
	const tronWeb = window.tronWeb;
	//查询智能合约是否存在
	let instance = await tronWeb.contract().at(contractAddress);
	//instance["合约方法"](‘参数’)
	let res = await instance["transfer"](recipient, amount);
	//使用send来执行智能合约方法，消耗资源并且还广播到网络。
	//feeLimit	调用合约方法消耗最大数量的SUN。上限是 1000 TRX。(1TRX = 1,000,000SUN)	Integer
	//callValue	本次调用往合约转账的SUN。	Integer
	//shouldPollResponse 如果设置为 TRUE，则会等到在 Solidity 节点上确认事务之后再返回结果。 Boolean
	//tokenId	本次调用往合约中转账TRC10的tokenId。如果没有，不需要设置	String
	//tokenValue	本次调用往合约中转账TRC10的数量，如果不设置tokenId，这项不设置。	Integer
	res.send({
		feeLimit: 100000000,
		callValue: 0,
		shouldPollResponse: false
	}).then(
		res => {
			console.log(res)
			callback(res)
		},
		err => {
			errorCallBack(err)
		}
	);
}

//导出相对应的方法
export default {
	init,
	transfer
};