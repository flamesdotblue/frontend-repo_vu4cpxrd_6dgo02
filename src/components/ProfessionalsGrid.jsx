import { Star, MapPin, Phone } from "lucide-react";

function ServiceBadge({ type }) {
  const map = {
    plumber: { label: "Plumber", color: "bg-blue-100 text-blue-700" },
    electrician: { label: "Electrician", color: "bg-amber-100 text-amber-700" },
    gas: { label: "Gas Service", color: "bg-red-100 text-red-700" },
  };
  const conf = map[type] ?? map.plumber;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${conf.color}`}>
      {conf.label}
    </span>
  );
}

export default function ProfessionalsGrid({ professionals }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {professionals.map((pro) => (
        <article key={pro.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{pro.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{pro.location}</span>
                </div>
              </div>
              <ServiceBadge type={pro.service} />
            </div>

            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(pro.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
              ))}
              <span className="ml-2 text-sm text-gray-600">{pro.rating.toFixed(1)}</span>
            </div>

            <p className="mt-3 text-sm text-gray-600 line-clamp-3">{pro.bio}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {pro.availability.slice(0, 3).map((slot, idx) => (
                <span key={idx} className="px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700">{slot}</span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <a
                href={`tel:${pro.phone}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Phone className="h-4 w-4" /> Call now
              </a>
              <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-white text-sm hover:bg-blue-700">
                Book slot
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
