import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import ProfessionalsGrid from "./components/ProfessionalsGrid";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import BookingModal from "./components/BookingModal";

const DEFAULT_PROFESSIONALS = [
  // Vijayawada
  { id: "p1", name: "Ravi Kumar", service: "plumber", location: "Vijayawada", rating: 4.7, phone: "+91 9876543210", bio: "Expert in leak repairs, pipe fitting, and bathroom installations with 8+ years experience.", availability: ["Today 2:00 PM", "Today 6:00 PM", "Tomorrow 10:00 AM", "Tomorrow 4:00 PM"] },
  { id: "e1", name: "Sumanth Reddy", service: "electrician", location: "Vijayawada", rating: 4.6, phone: "+91 9876543201", bio: "Licensed electrician for wiring, MCB panels, inverter setup and emergency fixes.", availability: ["Today 1:00 PM", "Today 5:30 PM", "Tomorrow 11:30 AM"] },
  { id: "g1", name: "Harika Devi", service: "gas", location: "Vijayawada", rating: 4.8, phone: "+91 9876543299", bio: "Gas stove, regulator, and pipeline checks. Safety-first certified technician.", availability: ["Today 3:00 PM", "Tomorrow 9:00 AM", "Tomorrow 6:00 PM"] },
  // Guntur
  { id: "p2", name: "Mahesh Babu", service: "plumber", location: "Guntur", rating: 4.5, phone: "+91 9876500001", bio: "Quick response for blockages, tap replacements, and water heater installation.", availability: ["Today 12:00 PM", "Tomorrow 10:30 AM", "Tomorrow 5:00 PM"] },
  { id: "e2", name: "Anil Kumar", service: "electrician", location: "Guntur", rating: 4.9, phone: "+91 9876500002", bio: "Specialist in short-circuit fixes, fans, lights, and earthing solutions.", availability: ["Today 4:00 PM", "Tomorrow 12:00 PM"] },
  // Visakhapatnam
  { id: "e3", name: "Naveen Varma", service: "electrician", location: "Visakhapatnam", rating: 4.7, phone: "+91 9876500003", bio: "Industrial and home electrical service with fast on-site troubleshooting.", availability: ["Today 11:00 AM", "Tomorrow 2:30 PM"] },
  { id: "p3", name: "Sruthi K", service: "plumber", location: "Visakhapatnam", rating: 4.6, phone: "+91 9876500004", bio: "Sanitary fittings, kitchen plumbing, and pressure pump setups.", availability: ["Today 6:30 PM", "Tomorrow 9:30 AM"] },
  { id: "g2", name: "Vamsi Krishna", service: "gas", location: "Visakhapatnam", rating: 4.8, phone: "+91 9876500005", bio: "Pipeline checks, gas leak detection and quick replacements.", availability: ["Today 1:30 PM", "Tomorrow 11:00 AM"] },
  // Tirupati
  { id: "p4", name: "Sita Ram", service: "plumber", location: "Tirupati", rating: 4.4, phone: "+91 9876500006", bio: "All bathroom and kitchen plumbing with same-day service.", availability: ["Today 5:00 PM", "Tomorrow 10:00 AM"] },
  { id: "e4", name: "Pranay Teja", service: "electrician", location: "Tirupati", rating: 4.7, phone: "+91 9876500007", bio: "MCB, wiring, and appliance connection expert.", availability: ["Today 12:30 PM", "Tomorrow 3:00 PM"] },
  // Nellore
  { id: "g3", name: "Kavya Sri", service: "gas", location: "Nellore", rating: 4.6, phone: "+91 9876500008", bio: "Cooktop servicing, regulator changes, and burner cleaning.", availability: ["Today 2:30 PM", "Tomorrow 4:30 PM"] },
  { id: "e5", name: "Rahul Dev", service: "electrician", location: "Nellore", rating: 4.5, phone: "+91 9876500009", bio: "Emergency power restoration and fault detection.", availability: ["Today 3:45 PM", "Tomorrow 1:15 PM"] },
  // Rajahmundry
  { id: "p5", name: "Bhargav", service: "plumber", location: "Rajahmundry", rating: 4.7, phone: "+91 9876500010", bio: "Water purifier, geyser, and pipeline installation.", availability: ["Today 1:45 PM", "Tomorrow 11:30 AM"] },
  { id: "g4", name: "Shankar", service: "gas", location: "Rajahmundry", rating: 4.6, phone: "+91 9876500011", bio: "LPG hose, nozzle replacement and safety checks.", availability: ["Today 4:45 PM", "Tomorrow 12:45 PM"] },
  // Kakinada
  { id: "e6", name: "Sowmya", service: "electrician", location: "Kakinada", rating: 4.8, phone: "+91 9876500012", bio: "Smart-home wiring, LED panels and inverter maintenance.", availability: ["Today 6:00 PM", "Tomorrow 10:15 AM"] },
  // Vizianagaram
  { id: "p6", name: "Venkatesh", service: "plumber", location: "Vizianagaram", rating: 4.4, phone: "+91 9876500013", bio: "Clog removal, faucet repair and water line fixes.", availability: ["Today 12:15 PM", "Tomorrow 2:15 PM"] },
  // Anantapur
  { id: "e7", name: "Manoj Kumar", service: "electrician", location: "Anantapur", rating: 4.5, phone: "+91 9876500014", bio: "Fan, tube-light, and switchboard services.", availability: ["Today 5:15 PM", "Tomorrow 9:45 AM"] },
  // Kadapa
  { id: "g5", name: "Niharika", service: "gas", location: "Kadapa", rating: 4.7, phone: "+91 9876500015", bio: "Full kitchen gas pipeline inspection and repair.", availability: ["Today 2:45 PM", "Tomorrow 1:00 PM"] },
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function App() {
  const [query, setQuery] = useState("");
  const [service, setService] = useState("");
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPro, setSelectedPro] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState("");

  const [professionals, setProfessionals] = useState(DEFAULT_PROFESSIONALS);
  const [loadingPros, setLoadingPros] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("eh_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
    const savedBookings = localStorage.getItem("eh_bookings");
    if (savedBookings) {
      try { setBookings(JSON.parse(savedBookings)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("eh_user", JSON.stringify(user));
    else localStorage.removeItem("eh_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("eh_bookings", JSON.stringify(bookings));
  }, [bookings]);

  // Fetch professionals from backend and map to UI shape
  useEffect(() => {
    async function fetchWorkers() {
      setLoadingPros(true);
      try {
        const params = new URLSearchParams();
        if (service) params.set("service_type", service);
        if (query) params.set("location", query);
        const res = await fetch(`${BACKEND_URL}/workers?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load workers");
        const data = await res.json();
        const mapped = data.map((w) => ({
          id: w.id,
          name: w.name,
          service: w.service_type,
          location: w.location,
          rating: w.rating ?? 4.6,
          phone: w.phone || "",
          bio: w.bio || "",
          availability: Array.isArray(w.availability) && w.availability.length > 0 ? w.availability : ["09:00-11:00", "13:00-15:00"],
        }));
        setProfessionals(mapped);
      } catch (e) {
        // fallback to default list if backend not reachable
        setProfessionals(DEFAULT_PROFESSIONALS);
      } finally {
        setLoadingPros(false);
      }
    }
    fetchWorkers();
  }, [service, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return professionals.filter((p) => {
      const matchesService = service ? p.service === service : true;
      const matchesQuery = q
        ? p.location.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
        : true;
      return matchesService && matchesQuery;
    });
  }, [query, service, professionals]);

  function openBooking(pro) {
    setSelectedPro(pro);
    setBookingOpen(true);
  }

  function deriveServiceDateISO(slotStr) {
    try {
      if (!slotStr) return new Date().toISOString().slice(0, 10);
      const lower = slotStr.toLowerCase();
      const today = new Date();
      if (lower.startsWith("today")) {
        return today.toISOString().slice(0, 10);
      }
      if (lower.startsWith("tomorrow")) {
        const t = new Date(today);
        t.setDate(today.getDate() + 1);
        return t.toISOString().slice(0, 10);
      }
      // If slot is a range like "09:00-11:00" we use today
      return today.toISOString().slice(0, 10);
    } catch {
      return new Date().toISOString().slice(0, 10);
    }
  }

  async function syncBookingToBackend(localRecord, note) {
    try {
      if (!user) return; // require login for backend persistence
      const payload = {
        user_id: user.id,
        worker_id: localRecord.professionalId,
        service_date: deriveServiceDateISO(localRecord.slot),
        time_slot: localRecord.slot,
        address: (note && note.trim()) || user.address || "Address to be confirmed",
      };
      await fetch(`${BACKEND_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // Silently ignore; local booking still shows
    }
  }

  function handleConfirmBooking(payload) {
    const withUser = user ? { userId: user.id, userName: user.name || user.email } : null;
    const record = { id: `${payload.professionalId}-${Date.now()}`, ...payload, ...(withUser || {}), status: "confirmed" };
    setBookings((prev) => [record, ...prev]);
    setBookingOpen(false);
    setToast(`Booked ${payload.slot} with ${payload.professionalName}`);
    // fire-and-forget sync to backend
    syncBookingToBackend(record, payload.note);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header user={user} onLoginClick={() => setLoginOpen(true)} onLogout={() => setUser(null)} />
      <Hero />

      <main className="mx-auto max-w-7xl px-4">
        <div className="mb-6 -mt-8">
          <Filters query={query} setQuery={setQuery} service={service} setService={setService} />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Available professionals</h2>
          <span className="text-sm text-gray-600">{loadingPros ? "Loading..." : `${filtered.length} found`}</span>
        </div>

        <ProfessionalsGrid professionals={filtered} onBook={openBooking} />

        {bookings.length > 0 && (
          <section className="mt-10">
            <h3 className="mb-3 text-lg font-semibold">Your bookings</h3>
            <ul className="divide-y rounded-lg border bg-white">
              {bookings.map((b) => (
                <li key={b.id} className="flex flex-col gap-1 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.professionalName} • {b.service}</p>
                    <p className="text-sm text-gray-600">{b.location} • {b.slot}</p>
                  </div>
                  <span className="mt-1 inline-flex w-max rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 md:mt-0">{b.status}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onAuthSuccess={setUser} />
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        professional={selectedPro}
        onConfirm={handleConfirmBooking}
      />

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
