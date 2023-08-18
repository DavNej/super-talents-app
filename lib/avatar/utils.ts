export function base64ToImgDataUrl(data: string) {
  return `data:image/jpeg;base64,` + data
}

export function imgDataUrlToBase64(dataUrl: string) {
  const fileExtension = dataUrl.substring(
    dataUrl.indexOf('/') + 1,
    dataUrl.indexOf(';')
  )
  const regex = new RegExp(`^data:image\/${fileExtension};base64,`)
  return dataUrl.replace(regex, '')
}
