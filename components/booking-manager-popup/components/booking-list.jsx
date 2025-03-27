"use client"
import { Clock, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function BookingList({ bookings, onSelectBooking }) {
  // Function to format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown time"
    try {
      const date = new Date(timestamp)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return timestamp
    }
  }

  return (
    <div className="space-y-2">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          onClick={() => onSelectBooking(booking)}
          className="group cursor-pointer rounded-lg border bg-card p-3 transition-all hover:bg-accent hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{booking.bookingId}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{formatTime(booking.serverTimestamp)}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      ))}
    </div>
  )
}

