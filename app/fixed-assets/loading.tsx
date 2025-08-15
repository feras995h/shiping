export default function FixedAssetsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gold-200 rounded"></div>
            <div className="h-10 w-64 bg-gold-200 rounded"></div>
          </div>
          <div className="h-6 w-80 bg-slate-200 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-slate-200 rounded"></div>
          <div className="h-10 w-40 bg-gold-200 rounded"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gold-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-28 bg-slate-200 rounded"></div>
              <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-8 w-32 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Assets List Skeleton */}
      <div className="bg-white rounded-lg border border-gold-200">
        <div className="p-6 border-b border-gold-100">
          <div className="h-8 w-48 bg-gold-200 rounded mb-2"></div>
          <div className="h-5 w-80 bg-slate-200 rounded"></div>
        </div>
        <div className="p-6">
          {/* Search and Filter Skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <div className="h-10 w-full bg-slate-200 rounded"></div>
            </div>
            <div className="h-10 w-48 bg-slate-200 rounded"></div>
            <div className="h-10 w-32 bg-slate-200 rounded"></div>
          </div>

          {/* Table Skeleton */}
          <div className="rounded-lg border border-gold-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gold-50 to-amber-50 p-4">
              <div className="grid grid-cols-11 gap-4">
                {[...Array(11)].map((_, i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gold-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4">
                  <div className="grid grid-cols-11 gap-4 items-center">
                    <div className="h-4 w-16 bg-slate-200 rounded"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    <div className="h-6 w-20 bg-slate-200 rounded"></div>
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    <div className="h-4 w-20 bg-blue-200 rounded"></div>
                    <div className="h-4 w-20 bg-red-200 rounded"></div>
                    <div className="h-4 w-20 bg-green-200 rounded"></div>
                    <div className="h-4 w-12 bg-purple-200 rounded"></div>
                    <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-slate-200 rounded"></div>
                      <div className="h-8 w-8 bg-slate-200 rounded"></div>
                      <div className="h-8 w-8 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Depreciation Summary Skeleton */}
      <div className="bg-white rounded-lg border border-gold-200 p-6">
        <div className="h-6 w-40 bg-gold-200 rounded mb-6"></div>
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-5 w-32 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
