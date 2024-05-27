const Web3 = require('web3');
const web3 = new Web3("https://mainnet.era.zksync.io");
// Thay sô lượng muốn mint ở đây đây
const mintTimes = 20
// Nhập private key ở đây  
const privateKeys = [
    "private key1",
    "private key2",
];

const contractAbi = [
  {
    inputs: [],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];

const contractAddress = '0x6aE134aD4D22D88F27C34869206E9336a03e80e5';
const contract = new web3.eth.Contract(contractAbi, contractAddress);

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function mintTokens(privateKey) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    try {
        const gasEstimate = await contract.methods.mint().estimateGas({
        from: account.address,
        value: 0
        });
        const gasPriceWei = await web3.eth.getGasPrice();
        console.log(gasEstimate)
        const receipt = await contract.methods.mint().send({
            from: account.address,
            gas: gasEstimate + 50000,
            gasPrice: gasPriceWei
        });

        console.log(`Mint transaction receipt for account ${account.address}`);
    } catch (error) {
        console.error(`Mint transaction error for account ${account.address}:`, error.message);

        if (error.data && error.data.message) {
        console.error('Revert reason:', error.data.message);
        }
    }
}

async function main() {
  for (const privateKey of privateKeys) {
    for(var i = 0; i < mintTimes; i ++) {
        await mintTokens(privateKey);
        await sleep(1000)
    }
  }
}

main();