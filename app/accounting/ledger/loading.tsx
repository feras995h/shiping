export default function LedgerLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gold-200 rounded"></div>
            <div className="h-10 w-64 bg-gold-200 rounded"></div>
          </div>
          <div className="h-6 w-96 bg-slate-200 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-slate-200 rounded"></div>
          <div className="h-10 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-lg border border-gold-200 p-6">
        <div className="h-6 w-48 bg-gold-200 rounded mb-4"></div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <div className="h-4 w-16 bg-slate-200 rounded"></div>
            <div className="h-10 w-full bg-slate-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-slate-200 rounded"></div>
            <div className="h-10 w-full bg-slate-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-slate-200 rounded"></div>
            <div className="h-10 w-full bg-slate-200 rounded"></div>
          </div>
          <div className="h-10 w-full bg-gold-200 rounded"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gold-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-8 w-32 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-20 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg border border-gold-200">
        <div className="p-6 border-b border-gold-100">
          <div className="h-8 w-64 bg-gold-200 rounded mb-2"></div>
          <div className="h-5 w-48 bg-slate-200 rounded"></div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4">
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-6 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
