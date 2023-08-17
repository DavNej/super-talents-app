import React from 'react'
import { IBundler, Bundler } from '@biconomy/bundler'
import { type Signer } from 'ethers'
import { ChainId } from '@biconomy/core-types'
import {
  BiconomySmartAccount,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account'
import {
  type IPaymaster,
  BiconomyPaymaster,
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from '@biconomy/paymaster'
import { toast } from 'react-toastify'

const chainId = ChainId.POLYGON_MUMBAI

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

const paymasterServiceData: SponsorUserOperationDto = {
  mode: PaymasterMode.SPONSORED,
}

export function useBiconomy() {
  const [smartAccount, setsmartAccount] =
    React.useState<BiconomySmartAccount | null>(null)

  const init = React.useCallback(
    async (signer: Signer) => {
      if (smartAccount) return
      console.log('💡 Creating Smart account')

      let biconomySmartAccount = new BiconomySmartAccount({
        signer,
        chainId,
        bundler,
        paymaster,
      })

      biconomySmartAccount = await biconomySmartAccount.init()
      console.log('🎉 Smart account created', biconomySmartAccount)
      console.log(
        'address: ',
        await biconomySmartAccount.getSmartAccountAddress()
      )
      setsmartAccount(biconomySmartAccount)
    },
    [smartAccount]
  )

  const sendUserOp = React.useCallback(
    async (
      transactions: {
        to: string
        data: string
        value?: number
      }[]
    ) => {
      if (!smartAccount) return

      let userOp = await smartAccount.buildUserOp(transactions)

      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>

      try {
        const paymasterAndDataResponse =
          await biconomyPaymaster.getPaymasterAndData(
            userOp,
            paymasterServiceData
          )

        userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData
      } catch (e) {
        toast.error('Paymaster setup error')
        console.error('Biconomy paymaster error', e)
      }

      try {
        const userOpResponse = await smartAccount.sendUserOp(userOp)
        const transactionDetails = await userOpResponse.wait()
        console.log('🦋 | TransactionDetails', transactionDetails)
        toast.success(
          'Success: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}'
        )
      } catch (e) {
        toast.error('Could not process transactions')
        console.error('Biconomy sendUserOp error ', e)
      }
    },
    [smartAccount]
  )

  return { init, sendUserOp }
}
