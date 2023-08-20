import Loader from './Loader'

export default function PageLoader() {
  return (
    <main className='flex-1 flex items-center justify-center'>
      <Loader size={500} />
    </main>
  )
}
