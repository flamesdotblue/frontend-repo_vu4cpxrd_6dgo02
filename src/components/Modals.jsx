import BookingModal from "./BookingModal";
import AuthModal from "./AuthModal";

export default function Modals({
  booking,
  auth,
}) {
  // booking: { open, onClose, professional, onConfirm }
  // auth: { open, onClose, onAuthed }
  return (
    <>
      <BookingModal
        open={booking.open}
        onClose={booking.onClose}
        professional={booking.professional}
        onConfirm={booking.onConfirm}
      />
      <AuthModal
        open={auth.open}
        onClose={auth.onClose}
        onAuthed={auth.onAuthed}
      />
    </>
  );
}
