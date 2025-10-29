import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Filters from "./components/Filters";
import ProfessionalsGrid from "./components/ProfessionalsGrid";
import BookingModal from "./components/BookingModal";

// Expanded catalog of professionals across Andhra Pradesh
const PROFESSIONALS = [
  // Plumbers
  { id: "pl-1", name: "Ravi Kumar", location: "Vijayawada", service: "plumber", rating: 4.7, bio: "Expert in leak repairs, pipe fitting, and bathroom installations.", phone: "+91 9876543101", availability: ["Today · 10:00-11:00", "Today · 12:00-13:00", "Tomorrow · 09:00-10:00", "Tomorrow · 16:00-17:00"] },
  { id: "pl-2", name: "Suresh B", location: "Guntur", service: "plumber", rating: 4.5, bio: "Quick response for emergencies, water tank and motor setup.", phone: "+91 9876543102", availability: ["Today · 11:00-12:00", "Today · 15:00-16:00", "Tomorrow · 10:00-11:00"] },
  { id: "pl-3", name: "Mohan P", location: "Visakhapatnam", service: "plumber", rating: 4.8, bio: "15+ years experience, PVC/CPVC/UPVC specialist.", phone: "+91 9876543103", availability: ["Today · 09:00-10:00", "Today · 17:00-18:00", "Tomorrow · 14:00-15:00"] },
  { id: "pl-4", name: "Anil K", location: "Tirupati", service: "plumber", rating: 4.3, bio: "Bathroom remodeling, geyser connection, drainage cleaning.", phone: "+91 9876543104", availability: ["Today · 13:00-14:00", "Tomorrow · 11:00-12:00", "Tomorrow · 18:00-19:00"] },
  { id: "pl-5", name: "Venkatesh", location: "Nellore", service: "plumber", rating: 4.6, bio: "Kitchen and bathroom fixtures, tap and shower replacements.", phone: "+91 9876543105", availability: ["Today · 10:30-11:30", "Tomorrow · 09:30-10:30", "Tomorrow · 15:30-16:30"] },
  { id: "pl-6", name: "Karthik", location: "Rajahmundry", service: "plumber", rating: 4.4, bio: "Overhead tank installation and maintenance specialist.", phone: "+91 9876543106", availability: ["Today · 12:30-13:30", "Tomorrow · 10:30-11:30", "Tomorrow · 17:30-18:30"] },

  // Electricians
  { id: "el-1", name: "Pradeep", location: "Vijayawada", service: "electrician", rating: 4.8, bio: "Wiring, MCB/DB upgrades, inverter and stabilizer setup.", phone: "+91 9876543201", availability: ["Today · 10:00-11:00", "Today · 16:00-17:00", "Tomorrow · 11:00-12:00"] },
  { id: "el-2", name: "Raghav", location: "Guntur", service: "electrician", rating: 4.6, bio: "Fan, light, switchboard installation and fault finding.", phone: "+91 9876543202", availability: ["Today · 12:00-13:00", "Tomorrow · 09:00-10:00", "Tomorrow · 13:00-14:00"] },
  { id: "el-3", name: "Sai Teja", location: "Visakhapatnam", service: "electrician", rating: 4.7, bio: "Smart doorbells, Wi-Fi switches, and home automation basics.", phone: "+91 9876543203", availability: ["Today · 11:00-12:00", "Today · 14:00-15:00", "Tomorrow · 10:00-11:00"] },
  { id: "el-4", name: "Nagaraju", location: "Tirupati", service: "electrician", rating: 4.5, bio: "Geyser, chimney, and kitchen appliance wiring.", phone: "+91 9876543204", availability: ["Today · 09:00-10:00", "Tomorrow · 12:00-13:00", "Tomorrow · 17:00-18:00"] },
  { id: "el-5", name: "Mahesh", location: "Kakinada", service: "electrician", rating: 4.4, bio: "Short-circuit fixes and safety checks.", phone: "+91 9876543205", availability: ["Today · 13:00-14:00", "Tomorrow · 14:00-15:00", "Tomorrow · 18:00-19:00"] },
  { id: "el-6", name: "Vivek", location: "Visakhapatnam", service: "electrician", rating: 4.9, bio: "Premium fittings, LED upgrades, and neat workmanship.", phone: "+91 9876543206", availability: ["Today · 15:00-16:00", "Tomorrow · 11:30-12:30", "Tomorrow · 16:30-17:30"] },

  // Gas service
  { id: "gs-1", name: "Imran", location: "Vijayawada", service: "gas", rating: 4.6, bio: "Gas stove repair, pipeline inspection, leak detection.", phone: "+91 9876543301", availability: ["Today · 10:00-11:00", "Today · 12:00-13:00", "Tomorrow · 09:00-10:00"] },
  { id: "gs-2", name: "Rafi", location: "Guntur", service: "gas", rating: 4.5, bio: "Regulator, hose replacement, and burner cleaning.", phone: "+91 9876543302", availability: ["Today · 11:00-12:00", "Tomorrow · 12:00-13:00", "Tomorrow · 15:00-16:00"] },
  { id: "gs-3", name: "Jayanth", location: "Visakhapatnam", service: "gas", rating: 4.7, bio: "Certified technician for safety-first gas work.", phone: "+91 9876543303", availability: ["Today · 14:00-15:00", "Tomorrow · 10:00-11:00", "Tomorrow · 17:00-18:00"] },
  { id: "gs-4", name: "Farhan", location: "Tirupati", service: "gas", rating: 4.3, bio: "New pipeline fitting and stove ignition repairs.", phone: "+91 9876543304", availability: ["Today · 09:30-10:30", "Tomorrow · 13:30-14:30", "Tomorrow · 18:30-19:30"] },
  { id: "gs-5", name: "Naresh", location: "Nellore", service: "gas", rating: 4.4, bio: "Emergency leak control and ventilation checks.", phone: "+91 9876543305", availability: ["Today · 16:00-17:00", "Tomorrow · 11:00-12:00", "Tomorrow · 16:00-17:00"] },

  // AC Repair
  { id: "ac-1", name: "Arjun", location: "Vijayawada", service: "electrician", rating: 4.6, bio: "AC installation, gas refill, and servicing.", phone: "+91 9876543401", availability: ["Today · 10:00-11:00", "Tomorrow · 15:00-16:00", "Tomorrow · 18:00-19:00"] },
  { id: "ac-2", name: "Shiva", location: "Visakhapatnam", service: "electrician", rating: 4.5, bio: "Split/Window AC troubleshooting and maintenance.", phone: "+91 9876543402", availability: ["Today · 11:00-12:00", "Today · 17:00-18:00", "Tomorrow · 12:00-13:00"] },

  // Locksmith
  { id: "ls-1", name: "Ramesh", location: "Vijayawada", service: "electrician", rating: 4.4, bio: "Emergency door unlocks and lock replacements.", phone: "+91 9876543501", availability: ["Today · 09:00-10:00", "Today · 18:00-19:00", "Tomorrow · 10:00-11:00"] },
  { id: "ls-2", name: "Gopi", location: "Guntur", service: "electrician", rating: 4.2, bio: "Smart lock setup and key duplication.", phone: "+91 9876543502", availability: ["Today · 12:00-13:00", "Tomorrow · 09:00-10:00", "Tomorrow · 14:00-15:00"] },

  // Carpenter
  { id: "cp-1", name: "Srinu", location: "Rajahmundry", service: "plumber", rating: 4.5, bio: "Furniture repair, assembly, and custom carpentry.", phone: "+91 9876543601", availability: ["Today · 11:00-12:00", "Today · 16:00-17:00", "Tomorrow · 12:00-13:00"] },
  { id: "cp-2", name: "Hari", location: "Vizianagaram", service: "plumber", rating: 4.3, bio: "Door, window, and hinge fixes.", phone: "+91 9876543602", availability: ["Today · 10:00-11:00", "Tomorrow · 15:00-16:00", "Tomorrow · 18:00-19:00"] },

  // Cleaning
  { id: "cl-1", name: "Deepika", location: "Visakhapatnam", service: "plumber", rating: 4.7, bio: "Kitchen and bathroom deep cleaning expert.", phone: "+91 9876543701", availability: ["Today · 09:00-10:00", "Today · 14:00-15:00", "Tomorrow · 11:00-12:00"] },
  { id: "cl-2", name: "Sanjana", location: "Tirupati", service: "plumber", rating: 4.6, bio: "Sofa, mattress, and home sanitization.", phone: "+91 9876543702", availability: ["Today · 12:00-13:00", "Tomorrow · 10:00-11:00", "Tomorrow · 16:00-17:00"] },

  // Pest Control
  { id: "pc-1", name: "Anvesh", location: "Nellore", service: "gas", rating: 4.5, bio: "Termite, cockroach, and mosquito control.", phone: "+91 9876543801", availability: ["Today · 13:00-14:00", "Tomorrow · 09:00-10:00", "Tomorrow · 14:00-15:00"] },
  { id: "pc-2", name: "Vasanth", location: "Kakinada", service: "gas", rating: 4.4, bio: "Eco-friendly pest management solutions.", phone: "+91 9876543802", availability: ["Today · 11:30-12:30", "Tomorrow · 12:30-13:30", "Tomorrow · 17:30-18:30"] },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [service, setService] = useState("");
  const [bookings, setBookings] = useState(() => {
    try {
      const raw = localStorage.getItem("eh_bookings");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [user, setUser] = useState(null);

  // Booking modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activePro, setActivePro] = useState(null);

  useEffect(() => {
    localStorage.setItem("eh_bookings", JSON.stringify(bookings));
  }, [bookings]);

  const filtered = useMemo(() => {
    return PROFESSIONALS.filter((p) => {
      const matchesService = service ? p.service === service : true;
      const matchesQuery = query
        ? p.location.toLowerCase().includes(query.toLowerCase()) || p.name.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesService && matchesQuery;
    }).sort((a, b) => b.rating - a.rating);
  }, [query, service]);

  const handleBook = (pro) => {
    setActivePro(pro);
    setModalOpen(true);
  };

  const handleConfirmBooking = (payload) => {
    setBookings((prev) => [payload, ...prev]);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header
        user={user}
        onLoginClick={() => setUser({ name: "Guest" })}
        onLogout={() => setUser(null)}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        <section className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Emergency Home Services</h1>
          <p className="mt-2 text-gray-600">Plumbers, Electricians, Gas Service and more — trusted pros near you</p>
        </section>

        <Filters query={query} setQuery={setQuery} service={service} setService={setService} />

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Available professionals</h2>
            <span className="text-sm text-gray-600">{filtered.length} found</span>
          </div>
          <ProfessionalsGrid professionals={filtered} onBook={handleBook} />
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Your bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-600">No bookings yet. Pick a professional and book a convenient slot.</p>
          ) : (
            <ul className="divide-y rounded-lg border bg-white">
              {bookings.map((b, idx) => (
                <li key={idx} className="p-4 text-sm flex flex-wrap items-center gap-2 justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{b.professionalName}</p>
                    <p className="text-gray-600">{b.service.toUpperCase()} · {b.location}</p>
                  </div>
                  <div className="text-gray-700">{b.slot}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        professional={activePro}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}
