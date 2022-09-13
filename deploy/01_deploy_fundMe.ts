import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployFundMe: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
) {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId: number = network.config.chainId!

    let ethUsdPriceFeedAddress: string
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[network.name].ethUsdPriceFeed!
    }
    log("_____________________________________________\n")
    log("Deploying FundMe contract and waiting for confirmations...")
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 0
    })
    log(`FundMe deployed at ${fundMe.address}`)
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API
    ) {
        await verify(fundMe.address, args)
    }
}
export default deployFundMe
deployFundMe.tags = ["all", "fundMe"]

// module.exports = async (hre: HardhatRuntimeEnvironment) => {
//     const { getNamedAccounts, deployments } = hre
//     const { deploy, log } = deployments
//     const { deployer } = await getNamedAccounts()
//     const chainId = network.config.chainId

//     // Preparing Mocks based on network
//     let ethUsdPriceFeedAddress
//     if (developmentChains.includes(network.name)) {
//         const ethUsdAggregratoe = await deployments.get("MockV3Aggregator")
//         ethUsdPriceFeedAddress = ethUsdAggregratoe
//     } else {
//         ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
//     }

//     const fundMe = await deploy("FundMe", {
//         from: deployer,
//         args: [ethUsdPriceFeedAddress],
//         log: true
//     })
//     log("_________________________________________\n")
// }
// module.exports.tags = ["all", "fundme"]
