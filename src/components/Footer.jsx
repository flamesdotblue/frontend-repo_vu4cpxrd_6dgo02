export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Emergency Home Services · Andhra Pradesh</p>
        <p className="text-gray-500">Vijayawada · Guntur · Visakhapatnam · Tirupati · Nellore · Rajahmundry · Kakinada · Vizianagaram · Anantapur · Kadapa</p>
      </div>
    </footer>
  );
}
