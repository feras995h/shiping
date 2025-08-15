export default function IncomeStatementLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gold-200 rounded"></div>
            <div className="h-10 w-48 bg-gold-200 rounded"></div>
          </div>
          <div className="h-6 w-72 bg-slate-200 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-slate-200 rounded"></div>
          <div className="h-10 w-32 bg-slate-200 rounded"></div>
          <div className="h-10 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-lg border border-gold-200 p-6">
        <div className="h-6 w-32 bg-gold-200 rounded mb-4"></div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-16 bg-slate-200 rounded"></div>
              <div className="h-10 w-full bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics Skeleton */}
      <div className="grid gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gold-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
              <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-8 w-40 bg-slate-200 rounded mb-2"></div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 flex-1 bg-slate-200 rounded"></div>
              <div className="h-4 w-12 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Income Statement Skeleton */}
      <div className="bg-white rounded-lg border border-gold-200">
        <div className="p-6 border-b border-gold-100">
          <div className="h-8 w-32 bg-gold-200 rounded mb-2"></div>
          <div className="h-5 w-64 bg-slate-200 rounded"></div>
        </div>
        <div className="p-6 space-y-8">
          {/* Revenue Section Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-24 bg-green-200 rounded"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-12 bg-green-200 rounded"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-20 bg-green-200 rounded mb-1"></div>
                    <div className="h-3 w-12 bg-green-200 rounded"></div>
                  </div>
                </div>
              ))}
              <div className="h-16 w-full bg-green-200 rounded-lg"></div>
            </div>
          </div>

          {/* Operating Expenses Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-40 bg-red-200 rounded"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-3 px-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-12 bg-red-200 rounded"></div>
                    <div className="h-4 w-44 bg-slate-200 rounded"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-20 bg-red-200 rounded mb-1"></div>
                    <div className="h-3 w-12 bg-red-200 rounded"></div>
                  </div>
                </div>
              ))}
              <div className="h-16 w-full bg-red-200 rounded-lg"></div>
            </div>
          </div>

          {/* Operating Profit Skeleton */}
          <div className="h-16 w-full bg-blue-200 rounded-lg"></div>

          {/* Non-Operating Expenses Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-48 bg-orange-200 rounded"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-3 px-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-12 bg-orange-200 rounded"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-20 bg-orange-200 rounded mb-1"></div>
                    <div className="h-3 w-12 bg-orange-200 rounded"></div>
                  </div>
                </div>
              ))}
              <div className="h-16 w-full bg-orange-200 rounded-lg"></div>
            </div>
          </div>

          {/* Net Profit Skeleton */}
          <div className="h-20 w-full bg-purple-200 rounded-xl"></div>

          {/* Summary Analysis Skeleton */}
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4"
              >
                <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                      <div className="h-4 w-16 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
