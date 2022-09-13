import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { developmentChains } from "../helper-hardhat-config"

const DECIMALS = "18"
const INITIAL_PRICE = "2000000000000000000000"

const deployMocks: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
) {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log(`Local Network detected! DEploying Mocks...`)
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE]
        })
        log("Mocks deployed successfully")
        log("_______________________________________________\n")
    }
}
// module.exports = async (hre: HardhatRuntimeEnvironment) => {
//     const { getNamedAccounts, deployments } = hre
//     const { deploy, log } = deployments
//     const { deployer } = await getNamedAccounts()
//     // const chainId = network.config.chainId

//     if (developmentChains.includes(network.name)) {
//
//     }
// }

export default deployMocks
deployMocks.tags = ["all", "mocks"]
