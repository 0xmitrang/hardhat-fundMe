import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FundMe, MockV3Aggregator } from "../../typechain-types"
import { assert, expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { developmentChains } from "../../helper-hardhat-config"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function() {
          let fundMe: FundMe
          let deployer: SignerWithAddress
          let mockV3Aggregator: MockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", function() {
              it("sets the aggregator addresses correctly", async function() {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async function() {
              it("should fail if we dont send enough ETH", async function() {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("should update the amount funded data structure", async function() {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer.address
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("adds funder to array of getFunder", async function() {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer.address)
              })
          })

          describe("withdraw", async function() {
              beforeEach(async function() {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraw ETH from a single founder", async function() {
                  //Arrange
                  const startingFundMeBal = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBal = await ethers.provider.getBalance(
                      deployer.address
                  )
                  //Act
                  const txResponse = await fundMe.withdraw()
                  const txReceipt = await txResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = txReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBal = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBal = await ethers.provider.getBalance(
                      deployer.address
                  )
                  //Assert
                  assert.equal(endingFundMeBal.toString(), "0")
                  assert.equal(
                      startingFundMeBal.add(startingDeployerBal).toString(),
                      endingDeployerBal.add(gasCost).toString()
                  )
              })

              it("Cheap Withdraw ETH from a single founder", async function() {
                  //Arrange
                  const startingFundMeBal = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBal = await ethers.provider.getBalance(
                      deployer.address
                  )
                  //Act
                  const txResponse = await fundMe.cheaperWithdraw()
                  const txReceipt = await txResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = txReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBal = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBal = await ethers.provider.getBalance(
                      deployer.address
                  )
                  //Assert
                  assert.equal(endingFundMeBal.toString(), "0")
                  assert.equal(
                      startingFundMeBal.add(startingDeployerBal).toString(),
                      endingDeployerBal.add(gasCost).toString()
                  )
              })

              it("allows to withdraw with multiple getFunder", async function() {
                  //Arrange
                  const accounts = await ethers.getSigners()

                  for (let i = 1; i < 6; i++) {
                      const fundMeConnect = await fundMe.connect(accounts[i])
                      await fundMeConnect.fund({ value: sendValue })
                  }

                  const startingFundMeBal = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBal = await ethers.provider.getBalance(
                      deployer.address
                  )

                  //Act
                  const txResponse = await fundMe.withdraw()
                  const txReceipt = await txResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = txReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endingFundMeBal = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBal = await ethers.provider.getBalance(
                      deployer.address
                  )

                  //Assert
                  assert.equal(endingFundMeBal.toString(), "0")
                  assert.equal(
                      startingFundMeBal.add(startingDeployerBal).toString(),
                      endingDeployerBal.add(gasCost).toString()
                  )

                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await (
                              await fundMe.getAddressToAmountFunded(
                                  accounts[1].address
                              )
                          ).toString(),
                          "0"
                      )
                  }
              })

              it("cheaper Withdraw function", async function() {
                  //Arrange
                  const accounts = await ethers.getSigners()

                  for (let i = 1; i < 6; i++) {
                      const fundMeConnect = await fundMe.connect(accounts[i])
                      await fundMeConnect.fund({ value: sendValue })
                  }

                  const startingFundMeBal = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBal = await ethers.provider.getBalance(
                      deployer.address
                  )

                  //Act
                  const txResponse = await fundMe.cheaperWithdraw()
                  const txReceipt = await txResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = txReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endingFundMeBal = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBal = await ethers.provider.getBalance(
                      deployer.address
                  )

                  //Assert
                  assert.equal(endingFundMeBal.toString(), "0")
                  assert.equal(
                      startingFundMeBal.add(startingDeployerBal).toString(),
                      endingDeployerBal.add(gasCost).toString()
                  )

                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await (
                              await fundMe.getAddressToAmountFunded(
                                  accounts[1].address
                              )
                          ).toString(),
                          "0"
                      )
                  }
              })

              it("only allows the owner to withdraw", async function() {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnect = await fundMe.connect(attacker)
                  await expect(
                      attackerConnect.withdraw()
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
              })
          })
      })
