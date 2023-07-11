function Step({ isActive, caption }: { isActive: boolean; caption: string }) {
  return isActive ? (
    <div className='flex-1'>
      <p className='font-medium text-xl text-center'>{caption}</p>
      <div className='mt-3 h-3 rounded-full bg-pink'></div>
    </div>
  ) : (
    <div className='flex-1'>
      <p className='font-medium text-xl text-center opacity-70'>{caption}</p>
      <div className='mt-3 h-3 rounded-full bg-gray-700' />
    </div>
  )
}

export default function ProgressBar({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className='pt-12 px-24 flex flex-row gap-7'>
        <Step caption='Create avatar' isActive />
        <Step caption='Profile info' isActive={false} />
        <Step caption='Mint your profile NFT' isActive={false} />
      </div>
      {children}
    </>
  )
}
