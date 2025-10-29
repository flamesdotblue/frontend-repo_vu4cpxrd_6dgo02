import { useEffect, useMemo, useState } from "react";
import { X, Calendar, Clock } from "lucide-react";

export default function BookingModal({ open, onClose, professional, onConfirm }) {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    // reset selection whenever modal opens with a new professional
    if (open) {
      setSelectedSlot("");
      setNote("");
    }
  }, [open, professional?.id]);

  const slots = useMemo(() => {
    if (!professional) return [];
    return professional.availability ?? [];
  }, [professional]);

  if (!open || !professional) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-semibold">Book a slot with {professional.name}</h3>
          </div>
          <button onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-4">
          <div>
            <p className="text-sm text-gray-700">Select an available time slot:</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {slots.length === 0 && (
                <p className="col-span-2 text-sm text-gray-500">No slots available. Please try another professional.</p>
              )}
              {slots.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSlot(s)}
                  className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                    selectedSlot === s
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Clock className="h-4 w-4" /> {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500"
              placeholder="Landmark, access instructions, or issue details"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
          <div className="text-xs text-gray-600">
            Selected: {selectedSlot ? selectedSlot : "—"}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!selectedSlot) return;
                onConfirm({
                  professionalId: professional.id,
                  professionalName: professional.name,
                  service: professional.service,
                  location: professional.location,
                  slot: selectedSlot,
                  note: note.trim(),
                  createdAt: new Date().toISOString(),
                });
              }}
              disabled={!selectedSlot}
              className={`rounded-md px-4 py-2 text-sm text-white ${
                selectedSlot ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Confirm booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
