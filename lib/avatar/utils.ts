import { DataUrlType } from './types'

export function base64ToImgDataUrl(data: string) {
  // TODO match with zod base64 data
  // ^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$
  return (`data:image/jpeg;base64,` + data) as DataUrlType
}

export function imgDataUrlToBase64(dataUrl: DataUrlType) {
  const fileExtension = dataUrl.substring(
    dataUrl.indexOf('/') + 1,
    dataUrl.indexOf(';')
  )
  const regex = new RegExp(`^data:image\/${fileExtension};base64,`)
  return dataUrl.replace(regex, '')
}
