// import { ethers, network } from "hardhat"
// import { FundMe } from "../../typechain-types"
// import { assert, expect } from "chai"
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
// import { developmentChains } from "../../helper-hardhat-config"

// developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("FundMe", async function() {
//           let fundMe: FundMe
//           let deployer: SignerWithAddress
//           const sendValue = ethers.utils.parseEther("0.01")
//           console.log("Outside before each done ...")

//           beforeEach(async function() {
//               console.log("Inside before each ..")
//               console.log("Getting accounts ..")
//               const accounts = await ethers.getSigners()
//               console.log("accounts fetched..")

//               deployer = accounts[0]
//               // await deployments.fixture(["all"])
//               console.log("getting contract")
//               fundMe = await ethers.getContract("FundMe", deployer)
//               console.log("before each done ")
//           })

//           it("allows people to fund & withdraw", async function() {
//               //   const feeData: any = await ethers.provider.getFeeData()
//               console.log("Sending fund function")
//               let fundTx = await fundMe.fund({
//                   value: sendValue
//               })
//               console.log("Sent fund function")
//               console.log("Waiting for block confiramtion...")
//               await fundTx.wait(1)

//               console.log("Sending cheapWithdraw function")
//               let withdrawTx = await fundMe.cheaperWithdraw({
//                   //   gasLimit: 2000000
//                   //   gasPrice: feeData.gasPrice
//               })
//               console.log("Sent cheapWithdraw function")
//               console.log("Waiting for block confiramtion...")
//               await withdrawTx.wait(1)

//               console.log("Getting ending balance...")
//               const endingBal = await ethers.provider.getBalance(fundMe.address)
//               //   console.log("endingBal-->", endingBal)
//               console.log("ending bal fetched-->", endingBal.toString())

//               console.log("expecting ...")
//               expect(endingBal.toString()).to.equal("0")
//               assert.equal(endingBal.toString(), "0")
//               console.log("expect done ...")
//           })
//       })
import { assert } from "chai"
import { ethers, network } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { FundMe } from "../../typechain-types"

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function() {
          let fundMe: FundMe
          let deployer: SignerWithAddress

          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async function() {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              fundMe = await ethers.getContract("FundMe", deployer.address)
          })

          it("Allows people to fund and withdraw", async function() {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw({
                  gasLimit: 100000
              })
              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal..."
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
