export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white" />
      <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">On-demand help for plumbing, electrical, and gas issues</h1>
            <p className="mt-4 text-gray-600 text-lg">Book trusted professionals near you. Transparent schedules, instant booking, and reliable service — 24/7.</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">Verified Pros</span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">Same-day Slots</span>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">100% Secure</span>
            </div>
          </div>
          <div className="md:pl-10">
            <div className="rounded-xl border shadow-sm bg-white p-4">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center text-center">
                <div>
                  <p className="font-semibold text-gray-800">Emergency Home Services</p>
                  <p className="text-gray-500 text-sm">Book a trusted professional in minutes</p>
                </div>
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                <li className="px-3 py-2 bg-gray-50 rounded-md">Plumbers</li>
                <li className="px-3 py-2 bg-gray-50 rounded-md">Electricians</li>
                <li className="px-3 py-2 bg-gray-50 rounded-md">Gas Services</li>
                <li className="px-3 py-2 bg-gray-50 rounded-md">General Repairs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
