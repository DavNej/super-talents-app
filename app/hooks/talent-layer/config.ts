export enum NetworkEnum {
  LOCAL = 1337,
  MUMBAI = 80001,
}

export const SUPERTALENTS_PLATFORM_ID = 18
export const talentLayerAddress = '0x3F87289e6Ec2D05C32d8A74CCfb30773fF549306' // Mumbai

export interface ITalentLayerUser {
  address: string
  handle: string
  id: string
  cid?: string
}

type Config = {
  networkId: NetworkEnum
  subgraphUrl: string
  contracts: { [key: string]: `0x${string}` }
}

const mumbai: Config = {
  networkId: NetworkEnum.MUMBAI,
  subgraphUrl:
    'https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-mumbai',
  contracts: {
    talentLayerId: talentLayerAddress,
  },
}

const local: Config = {
  networkId: NetworkEnum.LOCAL,
  subgraphUrl: 'http://localhost:8020/',
  contracts: { talentLayerId: '0x2475F87a2A73548b2E49351018E7f6a53D3d35A4' },
}

const chains: { [networkId in NetworkEnum]: Config } = {
  [NetworkEnum.LOCAL]: local,
  [NetworkEnum.MUMBAI]: mumbai,
}

export const config =
  chains[process.env.NEXT_PUBLIC_NETWORK_ID as unknown as NetworkEnum]
