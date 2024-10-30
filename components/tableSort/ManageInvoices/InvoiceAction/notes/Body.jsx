import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { updateDoc } from "@/api/firebase/functions/upload";
import { CalendarIcon, Notebook, PlusCircle, Save, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
export default function Body({ booking }) {
  const [statusEntries, setStatusEntries] = useState(
    booking?.statusEntries || []
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (booking?.statusEntries) {
      setStatusEntries(booking.statusEntries);
    }
  }, [booking]);

  const handleReasonChange = (index, reason) => {
    const newEntries = [...statusEntries];
    newEntries[index].reason = reason;
    setStatusEntries(newEntries);
  };

  const handleDateChange = (index, date) => {
    const newEntries = [...statusEntries];
    newEntries[index].date = date;
    setStatusEntries(newEntries);
  };

  const handleAddEntry = () => {
    const entries = [...statusEntries, { date: new Date(), reason: "" }];
    setStatusEntries(entries);
  };

  const handleDeleteEntry = (index) => {
    const newEntries = statusEntries.filter((_, i) => i !== index);
    setStatusEntries(newEntries);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formattedEntries = statusEntries.map((entry) => ({
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
        {statusEntries?.map((entry, index) => (
          <div key={index} className="p-2">
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <div className="space-y-2">
                <Label htmlFor={`date-${index}`}>Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={`date-${index}`}
                    type="date"
                    className="pl-10"
                    value={format(new Date(entry.date), "yyyy-MM-dd")}
                    onChange={(e) =>
                      handleDateChange(index, new Date(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`reason-${index}`}>Emergency contact</Label>
                <div className="relative">
                  <Notebook className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={`reason-${index}`}
                    className="pl-10"
                    placeholder=" Accounts name BSB and Account Number"
                    value={entry?.reason || ""}
                    onChange={(e) => handleReasonChange(index, e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteEntry(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete entry</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleAddEntry}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Note
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
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
