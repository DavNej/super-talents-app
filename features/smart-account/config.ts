import { IBundler, Bundler } from '@biconomy/bundler'
import { ChainId } from '@biconomy/core-types'
import { DEFAULT_ENTRYPOINT_ADDRESS } from '@biconomy/account'
import {
  type IPaymaster,
  BiconomyPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from '@biconomy/paymaster'

const BICONOMY_BUNDLER_URL = process.env.BICONOMY_BUNDLER_URL as string
const BICONOMY_PAYMASTER_URL = process.env.BICONOMY_PAYMASTER_URL as string

export const chainId = ChainId.POLYGON_MUMBAI

export const bundler: IBundler = new Bundler({
  bundlerUrl: BICONOMY_BUNDLER_URL,
  chainId,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

export const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: BICONOMY_PAYMASTER_URL,
})

export const paymasterServiceData: SponsorUserOperationDto = {
  mode: PaymasterMode.SPONSORED,
}
