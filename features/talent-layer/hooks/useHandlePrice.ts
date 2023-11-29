import { ethers } from 'ethers'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import {
  talentLayerAddress,
  talentLayerInterface,
} from '@/features/talent-layer'
import { log } from '@/utils'

const RPC_TARGET = process.env.NEXT_PUBLIC_RPC_TARGET as string
const provider = new ethers.providers.JsonRpcProvider(RPC_TARGET)

const contract = new ethers.Contract(
  talentLayerAddress,
  talentLayerInterface,
  provider
)

type ReturnedData = { handlePrice: ethers.BigNumber }
type Options = UseQueryOptions<ReturnedData, unknown>

export default function useHandlePrice(
  { handle }: { handle: string },
  options: Options
) {
  return useQuery({
    queryKey: ['handle-price', handle],
    enabled: Boolean(handle),
    queryFn: async () => {
      try {
        log('👀 | Get handle price')
        const handlePrice: ethers.BigNumber = await contract.getHandlePrice(
          Number(handle)
        )
        return { handlePrice }
      } catch (err) {
        console.error('💥', err)
        throw new Error(`Could not get price of "${handle}"`)
      }
    },
    ...options,
  })
}
