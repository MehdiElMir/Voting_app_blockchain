const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

async function getBlockNumber() {
    try {
        const blockNumber = await web3.eth.getBlockNumber();
        console.log('Latest Block Number:', blockNumber);
    } catch (error) {
        console.error('Error:', error);
    }
}

getBlockNumber();
