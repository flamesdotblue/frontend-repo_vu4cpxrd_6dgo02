import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Filters from "./components/Filters";
import ProfessionalsGrid from "./components/ProfessionalsGrid";
import Modals from "./components/Modals";

const BACKEND = (import.meta.env.VITE_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");

export default function App() {
  const [query, setQuery] = useState("");
  const [service, setService] = useState("");

  const [professionals, setProfessionals] = useState([]);
  const [loadingPros, setLoadingPros] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  // Booking modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activePro, setActivePro] = useState(null);

  // Fetch professionals when filters change
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoadingPros(true);
      try {
        const params = new URLSearchParams();
        if (service) params.set("service_type", service);
        if (query) params.set("location", query);
        const res = await fetch(`${BACKEND}/workers${params.toString() ? `?${params.toString()}` : ""}`);
        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).map((w) => ({
          id: w.id,
          name: w.name,
          location: w.location,
          service: w.service_type,
          rating: typeof w.rating === "number" ? w.rating : 4.5,
          bio: w.bio || "Trusted professional",
          availability: Array.isArray(w.availability) ? w.availability : [],
          phone: w.phone || "+91 9999999999",
        }));
        setProfessionals(mapped);
      } catch (e) {
        setProfessionals([]);
      } finally {
        setLoadingPros(false);
      }
    }
    load();
    return () => controller.abort();
  }, [query, service]);

  // Fetch bookings for logged-in user
  useEffect(() => {
    if (!user?.id) {
      setBookings([]);
      return;
    }
    const controller = new AbortController();
    async function loadBookings() {
      setLoadingBookings(true);
      try {
        const res = await fetch(`${BACKEND}/bookings?user_id=${encodeURIComponent(user.id)}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        // display friendly fields by joining with professionals in memory when possible
        const proMap = new Map(professionals.map((p) => [p.id, p]));
        const mapped = list.map((b) => {
          const pro = proMap.get(b.worker_id);
          return {
            id: b.id,
            professionalName: pro?.name || b.worker_id,
            service: pro?.service || "service",
            location: pro?.location || "",
            slot: b.time_slot,
            createdAt: b.created_at || new Date().toISOString(),
          };
        });
        setBookings(mapped);
      } catch (e) {
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    }
    loadBookings();
    return () => controller.abort();
  }, [user, professionals]);

  const filtered = useMemo(() => {
    // Server already filtered; keep sort by rating for consistency
    return professionals.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [professionals]);

  const handleBook = (pro) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setActivePro(pro);
    setModalOpen(true);
  };

  const handleConfirmBooking = async (payload) => {
    if (!user) return;
    // payload: {professionalId, professionalName, service, location, slot, note, createdAt}
    try {
      const parseDate = () => {
        const s = String(payload.slot || "");
        const today = new Date();
        const d = new Date(today);
        if (s.toLowerCase().includes("tomorrow")) {
          d.setDate(today.getDate() + 1);
        }
        return d.toISOString().slice(0, 10);
      };
      const body = {
        user_id: user.id,
        worker_id: payload.professionalId,
        service_date: parseDate(),
        time_slot: payload.slot,
        address: user.address || "",
      };
      const res = await fetch(`${BACKEND}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to create booking");

      // Refresh bookings after successful creation
      setModalOpen(false);
      setActivePro(null);
      // Optimistically add a simplified entry to UI
      setBookings((prev) => [
        {
          id: data.id,
          professionalName: payload.professionalName,
          service: payload.service,
          location: payload.location,
          slot: payload.slot,
          createdAt: data.created_at || new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (e) {
      console.error(e);
      alert(e.message || "Could not create booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header
        user={user}
        onLoginClick={() => setAuthOpen(true)}
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
            <span className="text-sm text-gray-600">{loadingPros ? "Loading…" : `${filtered.length} found`}</span>
          </div>
          <ProfessionalsGrid professionals={filtered} onBook={handleBook} />
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Your bookings</h3>
          {!user ? (
            <p className="text-sm text-gray-600">Login to see and manage your bookings.</p>
          ) : loadingBookings ? (
            <p className="text-sm text-gray-600">Loading your bookings…</p>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-gray-600">No bookings yet. Pick a professional and book a convenient slot.</p>
          ) : (
            <ul className="divide-y rounded-lg border bg-white">
              {bookings.map((b) => (
                <li key={b.id} className="p-4 text-sm flex flex-wrap items-center gap-2 justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{b.professionalName}</p>
                    <p className="text-gray-600">{b.service?.toUpperCase()} · {b.location}</p>
                  </div>
                  <div className="text-gray-700">{b.slot}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Modals
        booking={{
          open: modalOpen,
          onClose: () => setModalOpen(false),
          professional: activePro,
          onConfirm: handleConfirmBooking,
        }}
        auth={{
          open: authOpen,
          onClose: () => setAuthOpen(false),
          onAuthed: (u) => {
            setUser(u);
            setAuthOpen(false);
          },
        }}
      />
    </div>
  );
}
