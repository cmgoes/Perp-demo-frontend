import { getStage, Stage } from "constant/stage"
import { Connection } from "container/connection"
import { MetaData } from "container/metadata"
import { constants } from "ethers"
import { useMemo } from "react"
import {
    ClearingHouseViewer__factory as ClearingHouseViewerFactory,
    ERC20__factory as Erc20Factory,
    Amm__factory as AmmFactory,
    AmmReader__factory as AmmReaderFactory,
    ClearingHouse__factory as ClearingHouseFactory,
    InsuranceFund__factory as InsuranceFundFactory,
    MetaTxGateway__factory as MetaTxGatewayFactory,
} from "types/contracts"
import { createContainer } from "unstated-next"
import { Amm } from "types/contracts/Amm"

export const Contract = createContainer(useContract)

// TODO: Should grab contract address info from metadata config.
// production: https://metadata.perp.exchange/production.json
// staging: https://metadata.perp.exchange/staging.json
const PRODUCTION_CONTRACTS = {"layers": {
    "layer1": {
      "contracts": {
        "RootBridge": {
          "name": "RootBridge",
          "address": "0xA51156F3F1e39d1036Ca4ba4974107A1C1815d1e"
        },
        "ChainlinkL1": {
          "name": "ChainlinkL1",
          "address": "0x05b1d5B3ad20769B3b71b658A1Df2290CD5A2376"
        },
        "PerpRewardNoVesting": {
          "name": "PerpRewardVesting",
          "address": "0xc523D13685a0EAdEd0d673a3755EB9888C2eB9a1"
        },
        "PerpRewardTwentySixWeeksVesting": {
          "name": "PerpRewardVesting",
          "address": "0xf4EC90Db4713d199a756c18069CD4BB4bf4b3E26"
        },
        "FeeTokenPoolDispatcherL1": {
          "name": "FeeTokenPoolDispatcherL1",
          "address": "0xcB1700BbC2f6EA5F8A588935eF4DB9919A2B3C09"
        },
        "StakedPerpToken": {
          "name": "StakedPerpToken",
          "address": "0x0f346e19F01471C02485DF1758cfd3d624E399B4"
        },
        "FeeRewardPoolL1": {
          "name": "FeeRewardPoolL1",
          "address": "0x8adbFBD19680930c76311C64eB8B389c0e4Af80F"
        },
        "PerpStakingRewardVesting": {
          "name": "PerpRewardVesting",
          "address": "0x49a4B8431Fc24BE4b22Fb07D1683E2c52bC56088"
        },
        "PerpStakingRewardNoVesting": {
          "name": "PerpRewardVesting",
          "address": "0xc2a9e84D77f4B534F049b593C282c5c91F24808A"
        },
        "MetaTxGateway": {
          "name": "MetaTxGateway",
          "address": "0x4B0E18570024598700268C73ce161BC587f9A69D"
        },
        "RootBridgeV2": {
          "name": "RootBridgeV2",
          "address": "0x09b0aBf075136189b60bEC98E2c9F4E971b24E86"
        }
      },
      "accounts": [],
      "network": "homestead",
      "externalContracts": {
        "foundationGovernance": "0x5E4B407eB1253527628bAb875525AaeC0099fFC5",
        "rewardGovernance": "0x9FE5f5bbbD3f2172Fa370068D26185f3d82ed9aC",
        "perp": "0xbc396689893d065f41bc2c6ecbee5e0085233447",
        "usdc": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "tether": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "ambBridgeOnEth": "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e",
        "multiTokenMediatorOnEth": "0x88ad09518695c6c3712AC10a214bE5109a655671",
        "proxyAdmin": "0x29853EcF31eaedcD9074a11A85A8C8b689165F0b"
      }
    },
    "layer2": {
      "contracts": {
        "MetaTxGateway": {
          "name": "MetaTxGateway",
          "address": "0xA51156F3F1e39d1036Ca4ba4974107A1C1815d1e"
        },
        "ClientBridge": {
          "name": "ClientBridge",
          "address": "0x05b1d5B3ad20769B3b71b658A1Df2290CD5A2376"
        },
        "InsuranceFund": {
          "name": "InsuranceFund",
          "address": "0x8C29F6F7fc1999aB84b476952E986F974Acb3824"
        },
        "L2PriceFeed": {
          "name": "L2PriceFeed",
          "address": "0xb0C0387bC0eBe8C8A6Cc7f089B12aB1a063AAfFb"
        },
        "ClearingHouse": {
          "name": "ClearingHouse",
          "address": "0x5d9593586b4B5edBd23E7Eba8d88FD8F09D83EBd"
        },
        "ETHUSDC": {
          "name": "Amm",
          "address": "0x8d22F1a9dCe724D8c1B4c688D75f17A2fE2D32df"
        },
        "BTCUSDC": {
          "name": "Amm",
          "address": "0x0f346e19F01471C02485DF1758cfd3d624E399B4"
        },
        "ClearingHouseViewer": {
          "name": "ClearingHouseViewer",
          "address": "0xA34FF755a75136517622EB75Ef839E527D71a013"
        },
        "AmmReader": {
          "name": "AmmReader",
          "address": "0x2FA2c9B377D9e152d52A42bcc403022baCb2aF05"
        },
        "YFIUSDC": {
          "name": "Amm",
          "address": "0xd41025350582674144102B74B8248550580bb869"
        },
        "DOTUSDC": {
          "name": "Amm",
          "address": "0x6de775aaBEEedE8EFdB1a257198d56A3aC18C2FD"
        },
        "SNXUSDC": {
          "name": "Amm",
          "address": "0xb397389B61cbF3920d297b4ea1847996eb2ac8E8"
        },
        "LINKUSDC": {
          "name": "Amm",
          "address": "0x80DaF8ABD5a6Ba182033B6464e3E39A0155DCC10"
        },
        "AAVEUSDC": {
          "name": "Amm",
          "address": "0x16A7ECF2c27Cb367Df36d39e389e66B42000E0dF"
        },
        "ChainlinkPriceFeed": {
          "name": "ChainlinkPriceFeed",
          "address": "0x6b984B28D3305B498A57329b3Db1b25a69FEfA94"
        },
        "SUSHIUSDC": {
          "name": "Amm",
          "address": "0xF559668108Ff57745D5e3077B0A7Dd92FFc6300c"
        },
        "COMPUSDC": {
          "name": "Amm",
          "address": "0x33FbaeFb2dCc3B7e0B80afbB4377C2EB64AF0a3A"
        },
        "RENUSDC": {
          "name": "Amm",
          "address": "0x922F28072BaBe6EA0C0c25cCD367Fda0748a5EC7"
        },
        "PERPUSDC": {
          "name": "Amm",
          "address": "0xfcAE57DB10356FCf76B6476B21ac14C504a45128"
        },
        "UNIUSDC": {
          "name": "Amm",
          "address": "0xeaC6CEE594EdD353351BaBc145C624849Bb70b11"
        },
        "CRVUSDC": {
          "name": "Amm",
          "address": "0xAB08fF2c726F2F333802630EE19F4146385CC343"
        },
        "MKRUSDC": {
          "name": "Amm",
          "address": "0xb48F7aCcc03a3C64114170291F352b37eEa26c0B"
        },
        "CREAMUSDC": {
          "name": "Amm",
          "address": "0x7B479a0a816ca33F8EB5A3312d1705a34d2d4C82"
        },
        "GRTUSDC": {
          "name": "Amm",
          "address": "0x187C938543f2BDE09Fe39034Fe3Ff797A3D35cA0"
        },
        "ALPHAUSDC": {
          "name": "Amm",
          "address": "0x26789518695b56e16F14008c35Dc1b281Bd5fc0E"
        },
        "FTTUSDC": {
          "name": "Amm",
          "address": "0x838B322610BD99a449091D3bF3FBA60D794909a9"
        }
      },
      "accounts": [],
      "network": "xdai",
      "externalContracts": {
        "foundationGovernance": "0x371D128A0a286800d3A5E830F1D26dFf237A3279",
        "arbitrageur": "0x1A48776f436bcDAA16845A378666cf4BA131eb0F",
        "usdc": "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
        "tether": "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
        "ambBridgeOnXDai": "0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59",
        "multiTokenMediatorOnXDai": "0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d",
        "proxyAdmin": "0x29853EcF31eaedcD9074a11A85A8C8b689165F0b",
        "referral": "0xF1d5BA04a25A6D88c468af932BFe2B1e78db7B45"
      }
    }
  }}
const STAGING_CONTRACTS = {"layers": {
    "layer1": {
      "contracts": {
        "RootBridge": {
          "name": "RootBridge",
          "address": "0x1e5433845880780B10e6570f2EEdB0826709C4Ae"
        },
        "ChainlinkL1": {
          "name": "ChainlinkL1",
          "address": "0xD16a6772163463C731e37Ef42c98EEe95f15A496"
        },
        "PerpRewardNoVesting": {
          "name": "PerpRewardVesting",
          "address": "0xd225Da8898F88E7B613Ea57eaE6b0fe510b2C4Cd"
        },
        "PerpRewardTwentySixWeeksVesting": {
          "name": "PerpRewardVesting",
          "address": "0x0607C2540c62aea495996Bb2C39b658FEb8d8978"
        },
        "FeeTokenPoolDispatcherL1": {
          "name": "FeeTokenPoolDispatcherL1",
          "address": "0x29853EcF31eaedcD9074a11A85A8C8b689165F0b"
        },
        "StakedPerpToken": {
          "name": "StakedPerpToken",
          "address": "0x05b1d5B3ad20769B3b71b658A1Df2290CD5A2376"
        },
        "FeeRewardPoolL1": {
          "name": "FeeRewardPoolL1",
          "address": "0xAA798BdeC1F19AcBe81A637C8A8089C912678Bf9"
        },
        "PerpStakingRewardVesting": {
          "name": "PerpRewardVesting",
          "address": "0x8d22F1a9dCe724D8c1B4c688D75f17A2fE2D32df"
        },
        "PerpStakingRewardNoVesting": {
          "name": "PerpRewardVesting",
          "address": "0x08fa612A94bBEeC0cE0aFD870132ca729848EFe8"
        },
        "MetaTxGateway": {
          "name": "MetaTxGateway",
          "address": "0xda9254fDDFC70DdFC49639489D257F8AE81f86f2"
        },
        "RootBridgeV2": {
          "name": "RootBridgeV2",
          "address": "0x76D536b68F75C956e688108A4E283f9c0aCFA578"
        }
      },
      "accounts": [],
      "network": "rinkeby",
      "externalContracts": {
        "foundationGovernance": "0xa230A4f6F38D904C2eA1eE95d8b2b8b7350e3d79",
        "rewardGovernance": "0x7cd11681690d25DAA202550E1B3F314C74A0Acd6",
        "perp": "0xaFfB148304D38947193785D194972a7d0d9b7F68",
        "tether": "0x40D3B2F06f198D2B789B823CdBEcD1DB78090D74",
        "usdc": "0x40D3B2F06f198D2B789B823CdBEcD1DB78090D74",
        "testnetFaucet": "0x9E9DFaCCABeEcDA6dD913b3685c9fe908F28F58c",
        "ambBridgeOnEth": "0xD4075FB57fCf038bFc702c915Ef9592534bED5c1",
        "multiTokenMediatorOnEth": "0x30F693708fc604A57F1958E3CFa059F902e6d4CB",
        "proxyAdmin": "0x0C55fE453eC5166FA56e495Dc02953cB0E29A67a"
      }
    },
    "layer2": {
      "contracts": {
        "MetaTxGateway": {
          "name": "MetaTxGateway",
          "address": "0x53ED8613b25f76ab67D41d5639cfA17444F3B6Cd"
        },
        "ClientBridge": {
          "name": "ClientBridge",
          "address": "0x2E31232498Ff056Fc23a47CE95EE5599e1F3ec26"
        },
        "InsuranceFund": {
          "name": "InsuranceFund",
          "address": "0x9503B498A194DA2866c6e6f614e6F0E168AD13e9"
        },
        "L2PriceFeed": {
          "name": "L2PriceFeed",
          "address": "0x1ADFB9dd0E32649d4B8a73c90C36DB92cCea5d41"
        },
        "ClearingHouse": {
          "name": "ClearingHouse",
          "address": "0xd1ab46526D555285E9b61f066B7673bb9b9B51b6"
        },
        "ETHUSDC": {
          "name": "Amm",
          "address": "0xF75C8c9EADBCA5D26dA43466aD5Be511Cb281668"
        },
        "BTCUSDC": {
          "name": "Amm",
          "address": "0x858fC2fB2132b76584eBa1F0d1e2F43d5e999bff"
        },
        "ClearingHouseViewer": {
          "name": "ClearingHouseViewer",
          "address": "0x132E8daAF63dead7137FF14cD609b8CF51249f5f"
        },
        "AmmReader": {
          "name": "AmmReader",
          "address": "0x2b37006dbCA6ad1F464B6BeB317cEE8c733415E7"
        },
        "SNXUSDC": {
          "name": "Amm",
          "address": "0x176C0C3d7f83e6119B83E8c50E784a113aA8Da4F"
        },
        "LINKUSDC": {
          "name": "Amm",
          "address": "0xB72c27Ff766c9FFB6715D7bc5f9cE82b6862618d"
        },
        "SDEFIUSDC": {
          "name": "Amm",
          "address": "0xF6886540399Ac4055f1Cf2b9110909277F2498A1"
        },
        "TRXUSDC": {
          "name": "Amm",
          "address": "0x3a2E1e21BcA6d00FbD9BD6eDeD7D7635AD17fb3c"
        },
        "SCEXUSDC": {
          "name": "Amm",
          "address": "0xEFB91c661a77aa40A4a9FF581C0c074Ac1c18aaD"
        },
        "ChainlinkPriceFeed": {
          "name": "ChainlinkPriceFeed",
          "address": "0xAE77D1342CDBC93842007C5190e5C096d65C1b9E"
        },
        "SUSHIUSDC": {
          "name": "Amm",
          "address": "0xC38108217bd3ceF28CCfa2bb74C670601c77995D"
        },
        "XAGUSDC": {
          "name": "Amm",
          "address": "0x8308091357Ac72570969957cfE85C82b37Ea750F"
        },
        "AUDUSDC": {
          "name": "Amm",
          "address": "0xC86837ad9c153F1F9DA6abE697FA99f455C0AaF4"
        },
        "PERPUSDC": {
          "name": "Amm",
          "address": "0x2E8504e558c0F96036f78E08Fb652Ac7304f7455"
        },
        "UNIUSDC": {
          "name": "Amm",
          "address": "0xA087B08162870BE17Ffa1b8818368fe36ed574B5"
        },
        "CRVUSDC": {
          "name": "Amm",
          "address": "0x093c250B04bb79b86968da87B524A533533a0fAE"
        },
        "MKRUSDC": {
          "name": "Amm",
          "address": "0xef22c60555E9e7b5367C8123597286756D1A53f5"
        },
        "CREAMUSDC": {
          "name": "Amm",
          "address": "0xf154f84697CD5072F767741C51Dd821Ff34BdF49"
        },
        "GRTUSDC": {
          "name": "Amm",
          "address": "0x2F1e59b906f37Bea9412D5Bf514bD3792A678fd1"
        },
        "ALPHAUSDC": {
          "name": "Amm",
          "address": "0xDcCFe6668B33928c4c11009B54F2c0782f86dc67"
        },
        "FTTUSDC": {
          "name": "Amm",
          "address": "0x7954B8A9559200a90286c7A13c3021b60b2CDd2a"
        }
      },
      "accounts": [],
      "network": "xdai",
      "externalContracts": {
        "foundationGovernance": "0x44883405Eb9826448d3E8eCC25889C5941E79d9b",
        "arbitrageur": "0xf76cFe9FcAFA43Ab5E1B74030BA329b291c545c9",
        "testnetFaucet": "0x9E9DFaCCABeEcDA6dD913b3685c9fe908F28F58c",
        "ambBridgeOnXDai": "0xc38D4991c951fE8BCE1a12bEef2046eF36b0FA4A",
        "multiTokenMediatorOnXDai": "0xA34c65d76b997a824a5E384471bBa73b0013F5DA",
        "tether": "0xe0B887D54e71329318a036CF50f30Dbe4444563c",
        "usdc": "0xe0B887D54e71329318a036CF50f30Dbe4444563c",
        "proxyAdmin": "0x773F8ff05Faa57F915a70713CD33787F826ECdc7",
        "referral": "0xEBF01cc4af96cfE356c90aB6AE9f83A0D6d8b6A4"
      }
    }
  }}

export const CONTRACT_ADDRESS = ((stage: Stage) =>
    ({
        [Stage.Production]: PRODUCTION_CONTRACTS,
        [Stage.Staging]: STAGING_CONTRACTS,
        [Stage.Development]: STAGING_CONTRACTS,
    }[stage]))(getStage())

interface AddressMap {
    ClearingHouseViewer: string
    InsuranceFund: string
    AmmReader: string
    ClearingHouse: string
    XDaiUsdc: string
    MetaTxGateway: string
}

// NOTE: get contract address from metadata config endpoints
function getAddressFromConfig(config: any): AddressMap {
    const {
        layers: {
            layer2: {
                contracts: { ClearingHouseViewer, ClearingHouse, InsuranceFund, AmmReader, MetaTxGateway },
                externalContracts: { tether: XDaiTether, usdc: XDaiUsdc },
            },
        },
    } = config
    return {
        ClearingHouseViewer: ClearingHouseViewer.address,
        InsuranceFund: InsuranceFund.address,
        AmmReader: AmmReader.address,
        ClearingHouse: ClearingHouse.address,
        XDaiUsdc: XDaiUsdc || XDaiTether, // remove this part once the perp metadata config only provide one quoteAssetSymbol address
        MetaTxGateway: MetaTxGateway.address,
    }
}

const defaultContractInstance = {
    isInitialized: false,
    erc20: null,
    clearingHouseViewer: null,
    clearingHouse: null,
    insuranceFund: null,
    metaTxGateway: null,
    amm: null,
    addressMap: null,
}

function useContract() {
    const { config } = MetaData.useContainer()
    const { ethProvider, xDaiProvider } = Connection.useContainer()

    return useMemo(() => {
        if (!config) {
            return defaultContractInstance
        }
        const contractAddress = getAddressFromConfig(config)
        return {
            isInitialized: true,
            erc20: {
                Eth: Erc20Factory.connect(constants.AddressZero, ethProvider),
                XDai: Erc20Factory.connect(constants.AddressZero, xDaiProvider),
            },
            insuranceFund: InsuranceFundFactory.connect(contractAddress.InsuranceFund, xDaiProvider),
            ammReader: AmmReaderFactory.connect(contractAddress.AmmReader, xDaiProvider),
            amm: AmmFactory.connect(constants.AddressZero, xDaiProvider) as Amm,
            addressMap: contractAddress,
            clearingHouseViewer: ClearingHouseViewerFactory.connect(contractAddress.ClearingHouseViewer, xDaiProvider),
            clearingHouse: ClearingHouseFactory.connect(contractAddress.ClearingHouse, xDaiProvider),
            metaTxGateway: MetaTxGatewayFactory.connect(contractAddress.MetaTxGateway, xDaiProvider),
        }
    }, [config, ethProvider, xDaiProvider])
}
