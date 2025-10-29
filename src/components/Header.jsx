import { Phone } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold">EH</div>
          <span className="font-semibold text-lg">Emergency Home Services</span>
        </div>
        <a href="tel:+919999999999" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
          <Phone className="h-4 w-4" />
          <span>24/7 Helpline</span>
        </a>
      </div>
    </header>
  );
}
