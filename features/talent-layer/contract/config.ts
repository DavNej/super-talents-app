import { ethers } from 'ethers'
import abi from './TalentLayerID.json'

// Mumbai testnet
export const talentLayerAddress = '0x3F87289e6Ec2D05C32d8A74CCfb30773fF549306'

export const talentLayerInterface = new ethers.utils.Interface(abi)

export const platformId = 18
