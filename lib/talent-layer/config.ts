export enum NetworkEnum {
  LOCAL = 1337,
  MUMBAI = 80001,
}

type Config = {
  networkId: NetworkEnum
  subgraphUrl: string
}

const mumbai: Config = {
  networkId: NetworkEnum.MUMBAI,
  subgraphUrl:
    'https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-mumbai',
}

const local: Config = {
  networkId: NetworkEnum.LOCAL,
  subgraphUrl: 'http://localhost:8020/',
}

const chains: { [networkId in NetworkEnum]: Config } = {
  [NetworkEnum.LOCAL]: local,
  [NetworkEnum.MUMBAI]: mumbai,
}

export const config = chains[NetworkEnum.MUMBAI]
// chains[process.env.NEXT_PUBLIC_NETWORK_ID as unknown as NetworkEnum]
