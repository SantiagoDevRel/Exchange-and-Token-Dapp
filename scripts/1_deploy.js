
const hre = require("hardhat");

async function main() {
  console.log("Getting contracts from factory")
  const Exchange = await hre.ethers.getContractFactory("Exchange")
  const Token = await hre.ethers.getContractFactory("Token");

  const [deployer, acc1, acc2] = await hre.ethers.getSigners()
  console.log(deployer.address)
  
  console.log("Deploying contracts")
  const exchange = await Exchange.deploy(deployer.address, 10)
  const tokenUSDX = await Token.deploy("Usdx Token", "USDX", 1000)
  const tokenBCK = await Token.deploy("Blockchain Token", "BCK", 1000)
  await exchange.deployed()
  await tokenUSDX.deployed()
  await tokenBCK.deployed()
  

  console.log(`TokenBCK deployed to: ${tokenBCK.address}`);
  console.log(`TokenUSDX deployed to: ${tokenUSDX.address}`);
  console.log(`Exchange deployed to: ${exchange.address}`);
 
}



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
