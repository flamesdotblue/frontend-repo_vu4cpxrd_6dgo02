import { MapPin } from "lucide-react";

export default function Filters({ query, setQuery, service, setService }) {
  return (
    <div className="w-full bg-white border rounded-xl p-4 shadow-sm">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search by city or area</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Vijayawada, Guntur, Vizag, Tirupati, Nellore"
              className="w-full pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All services</option>
            <option value="plumber">Plumber</option>
            <option value="electrician">Electrician</option>
            <option value="gas">Gas Service</option>
          </select>
        </div>
      </div>
    </div>
  );
}
