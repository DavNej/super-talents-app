import { useQuery } from '@tanstack/react-query'
import { BiconomySmartAccount } from '@biconomy/account'

import { useAuth } from '@/lib/hooks'
import { log } from '@/lib/utils'
import { chainId, bundler, paymaster } from '@/lib/biconomy/config'
import { toast } from 'react-toastify'

const initialData = { smartAccount: null, address: null }

export default function useBiconomy() {
  const { signer } = useAuth()

  const init = useQuery<{
    address: string | null
    smartAccount: BiconomySmartAccount | null
  }>({
    queryKey: ['biconomy-init'],
    enabled: Boolean(signer),
    initialData,
    queryFn: async () => {
      log('📜 | Creating Smart account')
      if (!signer) return initialData

      log('📜 | Creating Smart account hit')
      try {
        const _smartAccount = new BiconomySmartAccount({
          signer,
          chainId,
          bundler,
          paymaster,
        })

        const smartAccount = await _smartAccount.init()
        const address = await smartAccount.getSmartAccountAddress()
        log('🎉 Smart account created', address)

        return { smartAccount, address }
      } catch (err) {
        console.error(err)
        toast.error('Could not initialize smart account')
        return initialData
      }
    },
  })

  return init
}
