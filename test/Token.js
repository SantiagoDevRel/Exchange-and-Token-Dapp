const {ethers} = require("hardhat")
const {expect} = require("chai")

const tokens = (value) => {
    return ethers.utils.parseUnits(value.toString(), "ether")
}

describe("Token contract", ()=>{
    let token;
    
    beforeEach(async()=>{ //Runs before each "it"
        //Deploy contract before each function
        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy("Blockchain Token", "BCK", 1000000)
        await token.deployed()
    })

    describe("Token Deployment", ()=>{

        const _name = "Blockchain Token"
        const _symbol = "BCK"
        const _decimals = 10**18
        const _totalSupply = tokens(1000000)

        it("Has correct name", async()=>{
            //Get name and compare if is correct
            expect(await token.name()).to.equal(_name);
        })
    
        it("Has correct symbol", async()=>{
            //Get symbol and compare if is correct
            expect(await token.symbol()).to.equal(_symbol);
        })
    
        it("Correct 18 decimals", async()=>{
            //Get decimals and compare if is correct
            expect(await token.decimals()).to.equal((_decimals).toString());
        })
        
        it("Correct totalSupply", async()=>{
            expect(await token.totalSupply()).to.equal(_totalSupply);
        })
    })




})