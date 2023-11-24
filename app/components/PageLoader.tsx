import { Loader } from '@/app/components'

export default function PageLoader() {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black z-50'>
      <Loader size={500} />
    </div>
  )
}
