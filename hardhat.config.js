require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

//const [ALCHEMY_KEY, PRIVATE_KEY] = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  paths:{
    artifacts: "./src/artifacts"
  },
  networks:{
    hardhat:{
      chainId: 1337,
    },
    /* goerli:{"":""
        url: ALCHEMY_KEY,
        accounts:`[0x${PRIVATE_KEY}`,
    }, */
  },
};
