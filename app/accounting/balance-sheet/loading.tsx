export default function BalanceSheetLoading() {
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
          <div className="h-10 w-24 bg-slate-200 rounded"></div>
          <div className="h-10 w-32 bg-slate-200 rounded"></div>
          <div className="h-10 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-lg border border-gold-200 p-6">
        <div className="h-6 w-40 bg-gold-200 rounded mb-4"></div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
              <div className="h-10 w-full bg-slate-200 rounded"></div>
            </div>
          ))}
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
            <div className="h-8 w-36 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Balance Sheet Tables Skeleton */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Assets Skeleton */}
        <div className="bg-white rounded-lg border border-gold-200">
          <div className="p-6 border-b border-gold-100">
            <div className="h-8 w-32 bg-green-200 rounded mb-2"></div>
          </div>
          <div className="p-6 space-y-6">
            {/* Current Assets */}
            <div className="space-y-4">
              <div className="h-6 w-40 bg-green-200 rounded"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-12 bg-green-200 rounded"></div>
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-4 w-20 bg-green-200 rounded"></div>
                  </div>
                ))}
                <div className="h-12 w-full bg-green-100 rounded-lg"></div>
              </div>
            </div>

            {/* Fixed Assets */}
            <div className="space-y-4">
              <div className="h-6 w-36 bg-green-200 rounded"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-12 bg-green-200 rounded"></div>
                      <div className="h-4 w-28 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-4 w-20 bg-green-200 rounded"></div>
                  </div>
                ))}
                <div className="h-12 w-full bg-green-100 rounded-lg"></div>
              </div>
            </div>

            {/* Total Assets */}
            <div className="h-16 w-full bg-green-200 rounded-lg"></div>
          </div>
        </div>

        {/* Liabilities and Equity Skeleton */}
        <div className="bg-white rounded-lg border border-gold-200">
          <div className="p-6 border-b border-gold-100">
            <div className="h-8 w-48 bg-slate-200 rounded mb-2"></div>
          </div>
          <div className="p-6 space-y-6">
            {/* Current Liabilities */}
            <div className="space-y-4">
              <div className="h-6 w-40 bg-red-200 rounded"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-12 bg-red-200 rounded"></div>
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-4 w-20 bg-red-200 rounded"></div>
                  </div>
                ))}
                <div className="h-12 w-full bg-red-100 rounded-lg"></div>
              </div>
            </div>

            {/* Long-term Liabilities */}
            <div className="space-y-4">
              <div className="h-6 w-44 bg-red-200 rounded"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-12 bg-red-200 rounded"></div>
                      <div className="h-4 w-28 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-4 w-20 bg-red-200 rounded"></div>
                  </div>
                ))}
                <div className="h-12 w-full bg-red-100 rounded-lg"></div>
              </div>
            </div>

            {/* Total Liabilities */}
            <div className="h-14 w-full bg-red-200 rounded-lg"></div>

            {/* Equity */}
            <div className="space-y-4">
              <div className="h-6 w-32 bg-blue-200 rounded"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-12 bg-blue-200 rounded"></div>
                      <div className="h-4 w-36 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-4 w-20 bg-blue-200 rounded"></div>
                  </div>
                ))}
                <div className="h-12 w-full bg-blue-100 rounded-lg"></div>
              </div>
            </div>

            {/* Total */}
            <div className="h-16 w-full bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Balance Verification Skeleton */}
      <div className="bg-white rounded-lg border border-gold-200 p-6">
        <div className="h-6 w-48 bg-gold-200 rounded mb-4"></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center p-4 bg-white rounded-lg border">
              <div className="h-8 w-32 bg-slate-200 rounded mx-auto mb-2"></div>
              <div className="h-4 w-24 bg-slate-200 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
