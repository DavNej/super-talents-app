import React from 'react'

export default function HexagonImage({ src }: { src: string }) {
  return (
    <div className='w-[172px] h-[190px]'>
      <svg
        width='172'
        height='190'
        viewBox='0 0 172 190'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M14.5352 38.8353L72.3121 5.54121C80.5664 0.784642 90.7294 0.784633 98.9837 5.5412L156.761 38.8353C165.035 43.6037 170.135 52.4273 170.135 61.9776V128.474C170.135 138.024 165.035 146.848 156.761 151.616L98.9837 184.91C90.7294 189.667 80.5664 189.667 72.3121 184.91L14.5352 151.616C6.26046 146.848 1.16129 138.024 1.16129 128.474V61.9776C1.16129 52.4273 6.26044 43.6037 14.5352 38.8353Z'
          stroke='url(#colorGradient)'
          strokeWidth='3'
          fill='url(#pattern0)'
        />

        <defs>
          <pattern
            id='pattern0'
            patternContentUnits='objectBoundingBox'
            width='1'
            height='1'>
            <use
              href='#image'
              transform='matrix(0.00112549 0 0 0.000976562 -0.0762527 0)'
            />
          </pattern>

          <linearGradient
            id='colorGradient'
            x1='36.0229'
            y1='16.7067'
            x2='79.5215'
            y2='165.459'
            gradientUnits='userSpaceOnUse'>
            <stop stopColor='#34F5ED' />
            <stop offset='1' stopColor='#DF00B1' />
          </linearGradient>

          <image id='image' width='1024' height='1024' href={src} />
        </defs>
      </svg>
    </div>
  )
}
