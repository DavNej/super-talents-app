'use client'

export default function Button({
  caption,
  className,
  onClick,
}: {
  caption: string
  className?: string
  onClick: () => unknown
}) {
  return (
    <button
      className={`py-5 px-8 w-full rounded-full uppercase font-medium text-xl bg-white text-pink ${className}`}
      onClick={onClick}>
      {caption}
    </button>
  )
}
