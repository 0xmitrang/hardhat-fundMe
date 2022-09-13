export interface networkConfigItem {
    ethUsdPriceFeed?: string
    blockConfirmations?: number
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    localhost: {},
    hardhat: {},
    goerli: {
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        blockConfirmations: 4
    }
}

export const developmentChains = ["hardhat", "localhost"]

// const networkConfig = {
//     5: {
//         name: "goerli",
//         ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
//     },
//     134: {
//         name: "polygon",
//         ethUsdPriceFeed: "",
//     },
// }

// const DECIMALS = 8
// const INITIAL_ANSWER = 200000000000

// module.exports = {
//     networkConfig,
//     developmentChains,
//     DECIMALS,
//     INITIAL_ANSWER,
// }
