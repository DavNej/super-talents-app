import React from 'react'
import Image from 'next/image'

export default function HexagonImage({ src }: { src: string }) {
  const clipPath =
    'path("M74.0171 4.16112L12.0171 39.8888C4.58185 44.1734 0 52.1018 0 60.6833V132.06C0 140.641 4.58186 148.569 12.0171 152.854L74.0171 188.582C81.434 192.856 90.566 192.856 97.9829 188.582L159.983 152.854C167.418 148.569 172 140.641 172 132.06V60.6833C172 52.1018 167.418 44.1734 159.983 39.8888L97.9829 4.16112C90.566 -0.112901 81.434 -0.112899 74.0171 4.16112Z")'
  return (
    <Image
      src={src}
      style={{ clipPath, border: '2px solid red' }}
      alt='Profile picture'
      width={192}
      height={192}
    />
  )
}
