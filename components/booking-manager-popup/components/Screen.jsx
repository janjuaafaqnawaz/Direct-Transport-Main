"use client";

import { useEffect, useState, useRef } from "react";
import { X, Package, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "react-spring";
import BookingList from "./booking-list";
import BookingModal from "./booking-modal";
import { cn } from "@/lib/utils";

export default function BookingScreen({
  selectedBooking,
  setSelectedBooking,
  bookings,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasNewBooking, setHasNewBooking] = useState(false);
  const prevBookingsLength = useRef(bookings.length);
  const audioRef = useRef(null);

  // Position state for dragging
  const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(({ offset: [dx, dy] }) => set({ x: dx, y: dy }));

  // Detect new bookings
  useEffect(() => {
    if (bookings.length > prevBookingsLength.current) {
      setIsVisible(true);
      setHasNewBooking(true);
      const timer = setTimeout(() => setHasNewBooking(false), 5000);
      return () => clearTimeout(timer);
    }
    prevBookingsLength.current = bookings.length;
  }, [bookings]);

  useEffect(() => {
    audioRef?.current?.play();
  }, [hasNewBooking]);

  if (!bookings?.length > 0) return;

  if (!isVisible) {
    return (
      <AnimatePresence>
        <animated.div {...bind()}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <button
              onClick={() => setIsVisible(true)}
              className={cn(
                "flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all relative",
                hasNewBooking && "animate-pulse"
              )}
            >
              <Package size={18} />
              <span>Show Bookings</span>
            </button>
          </motion.div>
        </animated.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <audio ref={audioRef} src="/sound/notification.wav" preload="auto" />

      <animated.div
        {...bind()}
        style={{ x, y }}
        className={cn(
          "bg-white fixed bottom-4 right-4 z-50 w-80 rounded-lg bg-card shadow-xl border transition-all duration-300 overflow-hidden cursor-grab",
          hasNewBooking && "border-primary"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between p-3 text-primary-foreground transition-colors duration-500",
            hasNewBooking ? "bg-primary/90 animate-pulse" : "bg-primary"
          )}
        >
          <div className="flex items-center gap-2">
            {hasNewBooking ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 3, repeatDelay: 1.5 }}
              >
                <Bell size={18} />
              </motion.div>
            ) : (
              <Package size={18} />
            )}
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
              hasNewBooking={hasNewBooking}
            />
          )}
        </div>

        {/* Modal */}
        {selectedBooking && (
          <BookingModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </animated.div>
    </AnimatePresence>
  );
}
