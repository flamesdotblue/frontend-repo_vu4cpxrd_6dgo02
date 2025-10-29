import { useEffect, useMemo, useState } from 'react'
import { MapPin, Star, Wrench } from 'lucide-react'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function WorkersSection({ user }) {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ service_type: '', location: '' })

  const [bookingFor, setBookingFor] = useState(null)
  const [booking, setBooking] = useState({ date: '', time_slot: '', address: '' })
  const [bookingError, setBookingError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (filters.service_type) params.set('service_type', filters.service_type)
      if (filters.location) params.set('location', filters.location)
      const res = await fetch(`${backend}/workers?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load workers')
      const data = await res.json()
      setWorkers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredWorkers = useMemo(() => workers, [workers])

  const startBooking = (worker) => {
    setSuccessMsg('')
    setBookingFor(worker)
    setBooking({ date: '', time_slot: worker.availability?.[0] || '', address: '' })
    setBookingError('')
  }

  const submitBooking = async (e) => {
    e.preventDefault()
    if (!user) {
      setBookingError('Please login to book a service.')
      return
    }
    if (!booking.date || !booking.time_slot || !booking.address) {
      setBookingError('Please fill all booking fields')
      return
    }
    try {
      setBookingLoading(true)
      setBookingError('')
      const res = await fetch(`${backend}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          worker_id: bookingFor.id,
          service_date: booking.date,
          time_slot: booking.time_slot,
          address: booking.address,
        })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Failed to create booking')
      }
      setSuccessMsg('Booking requested successfully! We\'ll notify you once it\'s confirmed.')
      setBookingFor(null)
      setBooking({ date: '', time_slot: '', address: '' })
    } catch (err) {
      setBookingError(err.message)
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available professionals</h2>
          <p className="text-gray-600">Find trusted help near you and book a time that works.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filters.service_type} onChange={(e)=>setFilters({...filters, service_type:e.target.value})} className="border rounded-md px-3 py-2">
            <option value="">All services</option>
            <option value="plumber">Plumber</option>
            <option value="electrician">Electrician</option>
            <option value="gas">Gas</option>
          </select>
          <input value={filters.location} onChange={(e)=>setFilters({...filters, location:e.target.value})} placeholder="Search by location" className="border rounded-md px-3 py-2" />
          <button onClick={fetchWorkers} className="px-4 py-2 rounded-md bg-gray-900 text-white">Search</button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading workers...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredWorkers.length === 0 ? (
          <p className="text-gray-500">No workers found for your filters.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkers.map(w => (
              <li key={w.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-md bg-blue-50 text-blue-700"><Wrench size={18} /></div>
                      <h3 className="font-semibold text-gray-900">{w.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 capitalize">{w.service_type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500"><Star size={16} /><span className="text-sm font-medium">{w.rating?.toFixed?.(1) ?? w.rating}</span></div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{w.location}</span>
                </div>
                {w.availability?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500">Next availability</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {w.availability.slice(0,3).map((slot, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">{slot}</span>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={()=>startBooking(w)} className="mt-4 w-full rounded-md bg-blue-600 text-white py-2 hover:bg-blue-700">Book</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {bookingFor && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">Book {bookingFor.name}</h3>
              <button onClick={()=>setBookingFor(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={submitBooking} className="p-4 space-y-3">
              <input value={booking.date} onChange={(e)=>setBooking({...booking, date:e.target.value})} type="date" required className="w-full rounded-md border px-3 py-2" />
              <select value={booking.time_slot} onChange={(e)=>setBooking({...booking, time_slot:e.target.value})} required className="w-full rounded-md border px-3 py-2">
                <option value="">Select time slot</option>
                {bookingFor.availability?.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
              </select>
              <input value={booking.address} onChange={(e)=>setBooking({...booking, address:e.target.value})} placeholder="Service address" required className="w-full rounded-md border px-3 py-2" />
              {bookingError && <p className="text-sm text-red-600">{bookingError}</p>}
              <button disabled={bookingLoading} className="w-full rounded-md bg-blue-600 text-white py-2 hover:bg-blue-700 disabled:opacity-60">{bookingLoading ? 'Booking...' : 'Confirm booking'}</button>
            </form>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="mt-6 rounded-md bg-emerald-50 text-emerald-800 px-4 py-3 border border-emerald-200">{successMsg}</div>
      )}
    </section>
  )
}
