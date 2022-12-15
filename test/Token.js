const {ethers} = require("hardhat")
const {expect} = require("chai")

const tokens = (value) => {
    return ethers.utils.parseUnits(value.toString(), "ether")
}

describe("Token contract", ()=>{
    let token, accounts, deployer, _totalSupply, add1Receiver, add2Exchange, amount, tx, result;

    beforeEach(async()=>{ //Runs before each "it"
        //Deploy contract before each function
        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy("Blockchain Token", "BCK", 1000000)
        await token.deployed()
        accounts = await ethers.getSigners();
        add1Receiver = accounts[1];
        add2Exchange = accounts[2];
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

    describe("Token transfer",()=>{               
        describe("Success transfer",()=>{
            beforeEach(async()=>{
                amount = tokens(100);
                //Make the transfer
                tx = await token.connect(deployer).transfer(add1Receiver.address, amount);
                result = await tx.wait()
                
            })
    
            it("transfer from owner to add1Receiver",async()=>{            
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(add1Receiver.address)).to.equal(tokens(100))
    
            })
    
            it("transfer() emit Transfer event", async()=>{
                const event = result.events[0] //take the event from the transaction 
                expect(event.event).to.equal("Transfer");
                const args = event.args
                //console.log("Evt args",args) event arguments
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(add1Receiver.address)
                expect(args.value).to.equal(amount)
                
            })
        })


        describe("Failure transfer",()=>{
            it("transfer more funds than the balance", async()=>{
                const invalidAmount = tokens(10000000);
                await expect(token.connect(deployer).transfer(add1Receiver.address, invalidAmount)).to.be.rejected            
            })

        })


    })

    describe("Approving tokens",()=>{

        beforeEach(async()=>{
            amount = tokens(100);
            tx = await token.connect(deployer).approve(add2Exchange.address, amount);
            result = await tx.wait()            

        })

        it("success",async()=>{
            it("allocate and allowance for delegated token spending",async()=>{
                expect(await token.allowance(deployer.address, add2Exchange.address)).to.equal(amount) //check if deployer gave allowance to add2

            })
        })

        it("failure",async()=>{
             expect(await token.allowance(deployer.address, add1Receiver.address)).to.equal(0) //check if deployer gave allowance to add1
        })

        it("emit Approval event", async()=>{
            const event = result.events[0] //take the event from the transaction 
            expect(event.event).to.equal("Approval");
            const args = event.args
            expect(args.owner).to.equal(deployer.address)
            expect(args.spender).to.equal(add2Exchange.address)
            expect(args.value).to.equal(amount)
        })
    
        
    })
    
    
    describe("Transfer From ()",()=>{
        //transferir del exchange (desde el balance  de deployer, 500 tokens a add1Receiver)
        beforeEach(async()=>{
            amount = tokens(500);
            tx = await token.connect(deployer).approve(add2Exchange.address, amount); //giving allowance of 100 tokens
            result = await tx.wait()  
        })

        it("success", async()=>{
            expect(await token.balanceOf(add1Receiver.address)).to.equal(tokens(0));
            tx = await token.connect(add2Exchange).transferFrom(deployer.address, add1Receiver.address, amount);
            await tx.wait()
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(1000000-500));
            expect(await token.balanceOf(add1Receiver.address)).to.equal(amount);

        })

        it("failure - try to send more than the allowance", async()=>{
            expect(await token.balanceOf(add1Receiver.address)).to.equal(tokens(0));
            await expect(token.connect(add2Exchange).transferFrom(deployer.address, add1Receiver.address, amount+1)).to.be.rejected            
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(1000000));
            expect(await token.balanceOf(add1Receiver.address)).to.equal(0);
        })

        it("failure - try to send from a non-allowed address ", async()=>{
            expect(await token.balanceOf(add1Receiver.address)).to.equal(tokens(0));
            await expect(token.connect(add1Receiver.address).transferFrom(deployer.address, add1Receiver.address, amount+1)).to.be.rejected            
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(1000000));
            expect(await token.balanceOf(add1Receiver.address)).to.equal(0);
        })

        it("reset allowance to 0", async()=>{
            expect(await token.allowance(deployer.address,add2Exchange.address)).to.equal(tokens(500)) //check allowance 500 tokens
            tx = await token.connect(add2Exchange).transferFrom(deployer.address, add1Receiver.address, amount); //spend the 500 tokens
            await tx.wait()
            expect(await token.allowance(deployer.address,add2Exchange.address)).to.equal(0) //check allowance 0 tokens
        })

        it("emit Transfer event", async()=>{
            tx = await token.connect(add2Exchange).transferFrom(deployer.address, add1Receiver.address, amount);
            result = await tx.wait()
            const event = result.events[0] //take the event from the transaction 
            expect(event.event).to.equal("Transfer");
            const args = event.args
            expect(args.from).to.equal(deployer.address)
            expect(args.to).to.equal(add1Receiver.address)
            expect(args.value).to.equal(amount)
        })

    })

})