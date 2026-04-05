interface SkeletonCardsProps {
  count?: number;
}

export default function SkeletonCards({ count = 6 }: SkeletonCardsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i: number) => (
        <div
          key={i}
          className='rounded-2xl border border-cream bg-white px-4 py-3.5'
          aria-hidden='true'>
          <div className='flex items-center gap-3'>
            {/* Name + address */}
            <div className='flex-1 space-y-2'>
              <div className='skeleton h-4 w-2/3 rounded-lg' />
              <div className='skeleton h-3 w-full rounded-lg' />
            </div>

            {/* Distance placeholder */}
            <div className='skeleton h-8 w-10 rounded-lg shrink-0' />

            {/* Divider */}
            <div className='w-px h-8 bg-cream shrink-0' />

            {/* Directions placeholder */}
            <div className='skeleton h-8 w-14 rounded-lg shrink-0' />

            {/* Chevron placeholder */}
            <div className='skeleton h-4 w-4 rounded shrink-0' />
          </div>
        </div>
      ))}
    </>
  );
}
