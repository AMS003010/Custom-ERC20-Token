const { ethers } = require("hardhat");

async function main() {
    
    console.log('Getting the Carbon Chain token contract...');
    const contractAddress = '0xA03aA08c1B13a971a5F4DB5Bab25CF7227649889';
    const CarbonChainToken = await ethers.getContractAt('CarbonChainToken', contractAddress);
    const name = await CarbonChainToken.name();
    const symbol = await CarbonChainToken.symbol();
    const decimals = await CarbonChainToken.decimals();
    const recipientAddress = '0x33938D29D67C2f3D22566f8024De2dE3da18d412';
    const ownerAddress = '0x6F8aFA2f348AE85bc9B7E049623E6218701b1499';
    const signers = await ethers.getSigners();
    
    
    console.log('Initiating a transfer...');
    const transferAmount = 100;
    console.log(`Transferring ${transferAmount} ${symbol} tokens to ${recipientAddress} from ${ownerAddress}`);
    await CarbonChainToken.transfer(recipientAddress, ethers.utils.parseUnits(transferAmount.toString(), decimals));
    console.log('Transfer completed');
    

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });