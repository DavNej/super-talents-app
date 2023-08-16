import React from 'react'
import { IBundler, Bundler } from '@biconomy/bundler'
import { type Signer } from 'ethers'
import { ChainId } from '@biconomy/core-types'
import {
  BiconomySmartAccount,
  type BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account'
import {
  type IPaymaster,
  BiconomyPaymaster,
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from '@biconomy/paymaster'
import { talentLayerInterface } from '@/lib/talent-layer'

const chainId = ChainId.POLYGON_MUMBAI
const talentLayerAddress = '0x2475F87a2A73548b2E49351018E7f6a53D3d35A4'

const bundler: IBundler = new Bundler({
  bundlerUrl:
    'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
  chainId,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    'https://paymaster.biconomy.io/api/v1/80001/DqNBUdjR_.ad347838-4e86-4fe4-a47d-415dabee1d3b',
})

export function useBiconomy(signer: Signer) {
  // if (!signer) return { createAccount: () => {}, updateProfileData: () => {} }

  const { current: biconomySmartAccountConfig } =
    React.useRef<BiconomySmartAccountConfig>({
      signer,
      chainId,
      bundler,
      paymaster,
    })

  const createAccount = React.useCallback(async () => {
    let biconomySmartAccount = new BiconomySmartAccount(
      biconomySmartAccountConfig
    )
    biconomySmartAccount = await biconomySmartAccount.init()
    console.log('biconomySmartAccount', biconomySmartAccount)
    console.log('owner: ', biconomySmartAccount.owner)
    console.log(
      'address: ',
      await biconomySmartAccount.getSmartAccountAddress()
    )
    return biconomySmartAccount
  }, [biconomySmartAccountConfig])

  async function updateProfileData() {
    console.log('creating account')

    const smartAccount = await createAccount()

    const data = talentLayerInterface.encodeFunctionData('updateProfileData', [
      174,
      'QmXYy1B1zWAYTYsLX5MvDp5muCfQaNBjsBg6PQ1RXcLH93',
    ])

    const transaction = {
      to: talentLayerAddress,
      data,
      // value: parseEther('0.1'),
    }

    let partialUserOp = await smartAccount.buildUserOp([transaction])

    const biconomyPaymaster =
      smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>

    let paymasterServiceData: SponsorUserOperationDto = {
      mode: PaymasterMode.SPONSORED,
    }

    try {
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          partialUserOp,
          paymasterServiceData
        )

      partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData
    } catch (e) {
      console.log('biconomy paymaster error received ', e)
    }

    try {
      const userOpResponse = await smartAccount.sendUserOp(partialUserOp)
      const transactionDetails = await userOpResponse.wait()
      console.log(
        `transactionDetails: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`
      )
    } catch (e) {
      console.log('biconomy sendUserOp error received ', e)
    }
  }

  return { createAccount, updateProfileData }
}
