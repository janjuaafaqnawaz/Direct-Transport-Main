import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { updateDoc } from "@/api/firebase/functions/upload";
import { CalendarIcon, Notebook, PlusCircle, Save } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Body({ booking }) {
  const [statusEntries, setStatusEntries] = useState(
    booking?.statusEntries || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [entry, setEntry] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    reason: "",
  });

  useEffect(() => {
    if (booking?.statusEntries) {
      setStatusEntries(booking.statusEntries);
    }
  }, [booking]);

  const handleAddEntry = () => {
    if (!entry.date || !entry.reason.trim()) {
      toast.error("Both date and reason are required");
      return;
    }

    setStatusEntries((prev) => [...prev, entry]);
    setEntry({
      date: format(new Date(), "yyyy-MM-dd"),
      reason: "",
    });
    toast.success("Entry added locally. Save to persist.");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formattedEntries = [...statusEntries, entry].map((entry) => ({
        ...entry,
        date: entry.date ? format(new Date(entry.date), "yyyy-MM-dd") : "",
      }));

      await updateDoc("place_bookings", booking.id, {
        ...booking,
        statusEntries: formattedEntries,
      });

      toast.success("Notes updated successfully");
    } catch (error) {
      console.error("Failed to save notes:", error);
      toast.error("Failed to update notes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Manage notes for the Booking
        </p>
        <div className="p-2">
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
            {/* Date Input */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  className="pl-10"
                  value={entry.date}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      date: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Reason Input */}
            <div className="space-y-2">
              <Label htmlFor="reason">Text</Label>
              <div className="relative">
                <Notebook className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reason"
                  className="pl-10"
                  value={entry.reason}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      reason: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleAddEntry}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Note
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || !statusEntries.length}
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Notes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
