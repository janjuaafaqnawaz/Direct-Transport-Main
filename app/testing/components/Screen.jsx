"use client";

import { useEffect, useState } from "react";
import { Maximize2, Minimize2, X, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookingList from "./booking-list";
import BookingModal from "./booking-modal";
import { cn } from "@/lib/utils";

export default function BookingScreen({
  selectedBooking,
  setSelectedBooking,
  bookings,
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (bookings.length > 0) {
      setIsVisible(true); // Show the panel when a new booking arrives
      setShake(true); // Trigger shake animation
      setTimeout(() => setShake(false), 1000); // Stop shaking after 600ms
    }
  }, [bookings]);

  if (!isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
        >
          <Package size={18} />
          <span>Show Bookings</span>
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          x: shake ? [0, -5, 5, -5, 5, 0] : 0, // Shake effect when bookings update
        }}
        transition={{ type: "spring", stiffness: 300 }}
        className={cn(
          "fixed bottom-4 right-4 z-50 w-80 rounded-lg bg-card shadow-xl border transition-all duration-300 overflow-hidden"
        )}
        style={{
          width: "350px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary p-3 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Package size={18} />
            <p className="font-medium text-lg text-white">Booking Manager</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-full p-1 hover:bg-primary-foreground/20 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="max-h-[calc(80vh-3.5rem)] overflow-auto p-3">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Package size={40} className="mb-2 opacity-20" />
                <p>No recent bookings</p>
              </div>
            ) : (
              <BookingList
                bookings={bookings}
                onSelectBooking={setSelectedBooking}
              />
            )}
          </div>
        )}

        {/* Modal */}
        {selectedBooking && (
          <BookingModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
