export default function Loading() {
  return (
    <div
      className="min-h-screen pt-20 px-6 lg:px-12 w-full"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="mx-auto grid w-full max-w-[1200px] lg:grid-cols-[minmax(0,1fr)_380px] gap-12">
        <div className="skeleton-container">
          <div className="skeleton-block mb-4 h-6 w-40 rounded-sm" />
          <div className="skeleton-block mb-6 h-12 w-4/5 rounded-sm" />
          <div className="skeleton-block mb-3 h-5 w-full rounded-sm" />
          <div className="skeleton-block mb-3 h-5 w-full rounded-sm" />
          <div className="skeleton-block mb-3 h-5 w-3/4 rounded-sm" />

          <div className="my-16 h-px bg-fog-border dark:bg-white/10" />

          <div className="mb-8 h-8 w-48 rounded-sm skeleton-block" />
          <div className="space-y-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-6">
                <div className="skeleton-block h-20 w-20 shrink-0 rounded-full" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="skeleton-block h-5 w-56 rounded-sm" />
                  <div className="skeleton-block h-4 w-full rounded-sm" />
                  <div className="skeleton-block h-4 w-2/3 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="skeleton-block h-6 w-28 rounded-sm" />
            <div className="skeleton-block h-5 w-20 rounded-sm" />
            <div className="skeleton-block h-5 w-24 rounded-sm" />
            <div className="skeleton-block h-5 w-16 rounded-sm" />
            <div className="skeleton-block mt-10 h-5 w-32 rounded-sm" />
          </div>
        </aside>
      </div>
    </div>
  );
}