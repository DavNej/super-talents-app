import Image from 'next/image'

export default function Login() {
  return (
    <main className='flex flex-row gap-x-4 min-h-screen p-24 bg-gray-900 place-items-center bg-sign-up bg-right bg-no-repeat bg-contain'>
      <div className='flex-col flex-1'>
        <Image
          className='relative '
          src='/mask.png'
          alt='Next.js Logo'
          width={128}
          height={48}
          priority
        />
        <h3 className='font-semibold text-5xl my-7'>
          Sharing the Future of Work with Web3 and AI
        </h3>
        <ul>
          <li className='flex flex-col my-7'>
            <strong className='uppercase text-2xl text-blue'>talents</strong>
            <span className='font-normal text-lg opacity-60'>
              Truly own your profile and career
            </span>
          </li>
          <li className='flex flex-col my-7'>
            <strong className='uppercase text-2xl text-purple'>clients</strong>
            <span className='font-normal text-lg opacity-60'>
              Connect with the best talent in Web3 and AI
            </span>
          </li>
          <li className='flex flex-col my-7'>
            <strong className='uppercase text-2xl text-pink'>supporters</strong>
            <span className='font-normal text-lg opacity-60'>
              Support the talent you believe in and earn together
            </span>
          </li>
        </ul>
      </div>
      <div className='flex flex-1 justify-center align-middle'>
        <div className='bg-blue w-[519px] h-[644px]'></div>
      </div>
    </main>
  )
}
