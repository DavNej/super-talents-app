import {
  getParsedEthersError,
  RETURN_VALUE_ERROR_CODES,
} from '@enzoferey/ethers-error-parser'

import type { EthersError } from '@enzoferey/ethers-error-parser'

import { toast } from 'react-toastify'

export const showErrorTransactionToast = (error: any) => {
  console.error('error', error)
  let errorMessage = getParsedErrorMessage(error)
  if (error.response && error.response.status === 500) {
    errorMessage = error.response.data
  }
  toast.error(errorMessage)
}

function getParsedErrorMessage(error: any) {
  const parsedEthersError = getParsedEthersError(error as EthersError)
  if (
    parsedEthersError.errorCode ===
    RETURN_VALUE_ERROR_CODES.REJECTED_TRANSACTION
  ) {
    return `${parsedEthersError.errorCode} - user rejected transaction`
  } else {
    return `${parsedEthersError.errorCode} - ${parsedEthersError.context}`
  }
}
