const {ethers} = require("hardhat")
const {expect} = require("chai")

const tokens = (value) => {
    return ethers.utils.parseUnits(value.toString(), "ether")
}

describe("Token contract", ()=>{
    let token, accounts, deployer, _totalSupply, add1, add2;

    beforeEach(async()=>{ //Runs before each "it"
        //Deploy contract before each function
        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy("Blockchain Token", "BCK", 1000000)
        await token.deployed()
        accounts = await ethers.getSigners();
        add1 = accounts[1];
        add2 = accounts[2];
        deployer = accounts[0]
    })

    describe("Token Deployment", ()=>{

        const _name = "Blockchain Token"
        const _symbol = "BCK"
        const _decimals = 10**18
        _totalSupply = tokens(1000000)

        it("has correct name", async()=>{
            //Get name and compare if is correct
            expect(await token.name()).to.equal(_name);
        })
    
        it("has correct symbol", async()=>{ 
            //Get symbol and compare if is correct
            expect(await token.symbol()).to.equal(_symbol);
        })
    
        it("correct 18 decimals", async()=>{
            //Get decimals and compare if is correct
            expect(await token.decimals()).to.equal((_decimals).toString());
        })
        
        it("correct totalSupply", async()=>{
            expect(await token.totalSupply()).to.equal(_totalSupply);
        })

        it("balance of deployer === totalSupply", async()=>{
            expect(await token.balanceOf(deployer.address)).to.equal(_totalSupply);
        })
    })

    describe("Token transfer",async()=>{       
        let amount, tx, result;
        
        describe("Success transfer",()=>{
            beforeEach(async()=>{
                amount = tokens(100);
                //Make the transfer
                tx = await token.connect(deployer).transfer(add1.address, amount);
                result = await tx.wait()
                
            })
    
            it("transfer from owner to add1",async()=>{            
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(add1.address)).to.equal(tokens(100))
    
            })
    
            it("transfer() emit Transfer event", async()=>{
                const event = result.events[0] //take the event from the transaction 
                expect(event.event).to.equal("Transfer");
                const args = event.args
                //console.log("Evt args",args) event arguments
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(add1.address)
                expect(args.value).to.equal(amount)
                
            })
        })


        describe("Failure transfer",()=>{
            it("transfer more funds than the balance", async()=>{
                const invalidAmount = tokens(10000000);
                await expect(token.connect(deployer).transfer(add1.address, invalidAmount)).to.be.rejected            
            })

        })


    })









})