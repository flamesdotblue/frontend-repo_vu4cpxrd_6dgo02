import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import ProfessionalsGrid from "./components/ProfessionalsGrid";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";

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

export default function App() {
  const [query, setQuery] = useState("");
  const [service, setService] = useState("");
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("eh_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("eh_user", JSON.stringify(user));
    else localStorage.removeItem("eh_user");
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEFAULT_PROFESSIONALS.filter((p) => {
      const matchesService = service ? p.service === service : true;
      const matchesQuery = q
        ? p.location.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
        : true;
      return matchesService && matchesQuery;
    });
  }, [query, service]);

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
          <span className="text-sm text-gray-600">{filtered.length} found</span>
        </div>

        <ProfessionalsGrid professionals={filtered} />
      </main>

      <Footer />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onAuthSuccess={setUser} />
    </div>
  );
}
