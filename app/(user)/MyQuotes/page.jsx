"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyQuotes } from "@/api/firebase/functions/fetch";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  Trash,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Package,
  TruckIcon,
  Info,
  RefreshCcw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Form from "@/components/review_booking/form";
import { deleteDocument } from "@/api/firebase/functions/upload";
import { Button, ButtonGroup } from "@nextui-org/react";

export default function SavedQuotes() {
  const [user, setUser] = useState(null);
  const [myQuotes, setMyQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuote, setExpandedQuote] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // const user = await verifyAuth();
      // setUser(user);

      const quotes = await getMyQuotes("saved_quotes");
      if (quotes.length > 0) {
        setMyQuotes(quotes);
      } else {
        setMyQuotes([]);
        toast.error("No quotes found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDocument("saved_quotes", id);
      toast.success(`Quote ${id} deleted successfully`);
      setMyQuotes(myQuotes.filter((quote) => quote.docId !== id));
    } catch (error) {
      console.error("Error deleting quote:", error);
      toast.error("Failed to delete quote");
    }
  };

  const handleSelect = (quote) => {
    setSelectedQuote(quote);
    toast.success(`Quote ${quote.id} selected`);
    // Implement your selection logic here
  };

  const toggleExpand = (id) => {
    setExpandedQuote(expandedQuote === id ? null : id);
  };

  if (selectedQuote) {
    return (
      <Form
        type={selectedQuote.type}
        form={selectedQuote}
        cat={"place_job"}
        edit={false}
        action={(e) => {
          setSelectedQuote(null);
        }}
        back={true}
        diseble={true}
        fetchTolls={true}
        selectedEmail={""}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">
            Loading your quotes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="  w-full">
      <div className="  mx-auto py-6 px-4 max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Saved Quotes</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your saved delivery quotes
            </p>
          </div>

          <ButtonGroup>
            <Button color="primary">All ({myQuotes.length}) </Button>
            <Button color="primary" isIconOnly onClick={fetchData}>
              <RefreshCcw size={15} />
            </Button>
          </ButtonGroup>
        </div>

        {myQuotes.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <TruckIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No quotes found</h3>
            <p className="mt-2 text-muted-foreground">
              You do not have any saved quotes yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {myQuotes.map((quote, index) => (
              <Card
                key={quote.docId}
                className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                  expandedQuote === quote.docId ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <CardHeader className="bg-muted/50 pb-3 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1.5">
                        <TruckIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{quote.id}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            quote.createdAt.seconds * 1000
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(
                            quote.createdAt.seconds * 1000
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={"default"} className="ml-auto">
                      {index + 1}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="h-10 w-0.5 bg-gray-200"></div>
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3 text-green-500" />
                            <p className="text-sm font-medium">From</p>
                          </div>
                          <p className="text-sm">{quote.pickupSuburb}</p>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3 text-red-500" />
                            <p className="text-sm font-medium">To</p>
                          </div>
                          <p className="text-sm">{quote.deliverySuburb}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mt-1">
                          Price
                        </p>
                        <p className="text-xs">
                          ${Number.parseFloat(quote.totalPrice).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          GST
                        </p>
                        <p className="text-xs">${quote.gst.toFixed(2)}</p>

                        {quote?.totalTollsCost &&
                          quote?.totalTollsCost !== 0 &&
                          quote?.totalTollsCost !== "" && (
                            <>
                              <p className="text-xs text-muted-foreground mt-1">
                                Tolls
                              </p>
                              <p className="text-xs">
                                ${quote.totalTollsCost.toFixed(2)}
                              </p>
                            </>
                          )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex flex-col items-center rounded-md bg-muted/50 p-2">
                        <Calendar className="mb-1 h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs text-center">{quote.date}</p>
                      </div>
                      <div className="flex flex-col items-center rounded-md bg-muted/50 p-2">
                        <Clock className="mb-1 h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs text-center">{quote.time}</p>
                      </div>
                      <div className="flex flex-col items-center rounded-md bg-muted/50 p-2">
                        <Package className="mb-1 h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs text-center">{quote.service}</p>
                      </div>
                    </div>

                    <div
                      className={`mt-2 mx-2 transition-all duration-300 overflow-hidden max-h-[1000px]`}
                    >
                      <div className="space-y-4 rounded-lg bg-muted/30 p-3 text-sm">
                        <div className="space-y-2">
                          {quote.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between rounded-md bg-background p-2 text-xs"
                            >
                              <span>
                                {item.qty}x {item.type}
                              </span>
                              <span>
                                {item.length}x{item.width}x{item.height}m,{" "}
                                {item.weight}kg
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total Price
                        </p>
                        <p className="text-lg font-bold">
                          ${quote.totalPriceWithGST.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between bg-muted/50 p-3">
                  <ButtonGroup fullWidth>
                    <Button
                      variant="flat"
                      color="danger"
                      size="sm"
                      className="h-8"
                      onClick={() => handleDelete(quote.docId)}
                    >
                      <Trash className="mr-1 h-3.5 w-3.5" />
                      <span className="text-xs">Delete</span>
                    </Button>
                    <Button
                      variant="solid"
                      color="primary"
                      size="sm"
                      className="h-8"
                      onClick={() => handleSelect(quote)}
                    >
                      <CheckCircle className="mr-1 h-3.5 w-3.5" />
                      <span className="text-xs">Select</span>
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
