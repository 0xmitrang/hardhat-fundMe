import { run } from "hardhat"

const verify = async (contractAddress: string, args: any[]) => {
    console.log(`Verifying Conttract on Etherscan...`)
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        })
    } catch (err: any) {
        if (err.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(err)
        }
    }
}

export default verify
