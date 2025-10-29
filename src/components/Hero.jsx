import { Wrench, Plug, Flame } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 relative">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Fast, reliable help for home emergencies in Andhra Pradesh
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Book trusted plumbers, electricians, and gas technicians near you in minutes.
              Available across Vijayawada, Guntur, Vizag, Tirupati, and more.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm">
                <Wrench className="h-4 w-4" /> Plumbers
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-sm">
                <Plug className="h-4 w-4" /> Electricians
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-red-100 text-red-700 px-3 py-1 text-sm">
                <Flame className="h-4 w-4" /> Gas Services
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1 shadow-xl">
              <div className="h-full w-full rounded-lg bg-white grid place-items-center">
                <div className="text-center p-6">
                  <p className="text-2xl font-semibold">Book in 3 easy steps</p>
                  <ol className="mt-4 text-gray-600 space-y-2 text-left list-decimal list-inside">
                    <li>Choose a service and location</li>
                    <li>Pick a professional and time</li>
                    <li>Confirm your booking</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
