import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import "dotenv/config"

const COINMARKETCAP_API = process.env.COINMARKETCAP_API || ""
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API = process.env.ETHERSCAN_API || ""

const config: HardhatUserConfig = {
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            timeout: 120000
        }
    },
    mocha: {
        timeout: 120000
    },
    etherscan: {
        apiKey: ETHERSCAN_API
    },
    gasReporter: {
        enabled: true,
        currency: "USD"
        // coinmarketcap: COINMARKETCAP_API
        // token: "MATIC"
    },
    namedAccounts: {
        deployer: {
            default: 0
        }
    }
}

export default config
