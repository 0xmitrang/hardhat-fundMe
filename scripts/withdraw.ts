import { ethers, getNamedAccounts } from "hardhat"

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("withdrawing from contract...")

    const txResponse = await fundMe.cheaperWithdraw()
    await txResponse.wait(1)
    console.log("Got it back")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
