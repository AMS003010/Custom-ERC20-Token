const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with acconut: ", deployer.address);
  console.log("Account balance: ", (await deployer.getBalance()).toString());

  const MacVenturesToken = await hre.ethers.getContractFactory("CarbonChainToken");
  const token = await MacVenturesToken.deploy(50000);

  await token.deployed();

  console.log("Token address: ",token.address);

  await hre.run("verify:verify", {
    address: token.address,
    constructorArguments: [50000]
  });
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});