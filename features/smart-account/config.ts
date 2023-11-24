import { IBundler, Bundler } from '@biconomy/bundler'
import { ChainId } from '@biconomy/core-types'
import { DEFAULT_ENTRYPOINT_ADDRESS } from '@biconomy/account'
import {
  type IPaymaster,
  BiconomyPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from '@biconomy/paymaster'

const BICONOMY_BUNDLER_URL =
  'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44'

const BICONOMY_PAYMASTER_URL = process.env.BICONOMY_PAYMASTER_URL as string

export const chainId = ChainId.POLYGON_MUMBAI

export const bundler: IBundler = new Bundler({
  bundlerUrl:
    'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
  chainId,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

export const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    'https://paymaster.biconomy.io/api/v1/80001/DqNBUdjR_.ad347838-4e86-4fe4-a47d-415dabee1d3b',
})

export const paymasterServiceData: SponsorUserOperationDto = {
  mode: PaymasterMode.SPONSORED,
}
