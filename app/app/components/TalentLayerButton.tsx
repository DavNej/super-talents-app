'use client'

import React from 'react'
import { ethers } from 'ethers'

import { useTalentLayerContract } from '@/lib/talent-layer/contract/hooks'

import { Button } from '@/app/app/components'
import { useLocalStorage } from 'usehooks-ts'
import { useUploadToIPFS } from '@/lib/ipfs/hooks'
import { IPFSProfileType } from '@/features/profile/types'
import { useProfileIdOfHandle } from '@/lib/talent-layer/subgraph/hooks'

export default function TalentLayerButton({
  handle,
  signer,
  data,
}: {
  signer: ethers.providers.JsonRpcSigner
  handle: string
  data: IPFSProfileType
}) {
  const [pinataCid, setPinataCid] = useLocalStorage('pinataCid', '')
  const uploadToIPFS = useUploadToIPFS({ onSuccess: onIPFSUploadSuccess })

  const talentLayerContract = useTalentLayerContract({ signer })
  const profileIdOfHandle = useProfileIdOfHandle({ handle })
  const talentLayerId = profileIdOfHandle.data
  const hasTalentLayerId = talentLayerId || talentLayerId === 0

  const [shouldUpdateData, setShouldUpdateData] = React.useState(false)
  const cond = hasTalentLayerId && pinataCid && shouldUpdateData

  React.useEffect(() => {
    if (cond) {
      talentLayerContract.updateProfileData({
        id: talentLayerId,
        newCid: pinataCid,
      })
      setShouldUpdateData(false)
    }
  }, [cond, pinataCid, talentLayerContract, talentLayerId])

  async function onIPFSUploadSuccess(cid: string) {
    setPinataCid(cid)
    if (!hasTalentLayerId) {
      const res = await talentLayerContract.mintProfile({ handle })
      console.log('🦋 | onIPFSUploadSuccess | res', res)
    }
    setShouldUpdateData(true)
  }

  async function handleClick() {
    if (!handle) return console.error('missing connectedProfile handle')
    //TODO check if data has changed from IPFS before upload new data
    uploadToIPFS.mutate({ name: handle, content: data })
  }

  return (
    <Button isLoading={uploadToIPFS.isLoading} onClick={handleClick}>
      Mint my profile NFT
    </Button>
  )
}
