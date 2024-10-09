import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Truck, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DeliveryOptions() {
  return (
    <div className="min-h-[80vh]  flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Choose Your Delivery Option
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DeliveryOption
              href={"/PlaceTheBooking/Delivery/same_day"}
              icon={"/icons/SAME_DAY.png"}
              title="Same Day"
              description="Get your items delivered within hours"
            />
            <DeliveryOption
              href={"/PlaceTheBooking/Delivery/next_day"}
              icon={"/icons/NEXT_DAY.png"}
              title="Next Day"
              description="Receive your package by tomorrow"
            />
            <DeliveryOption
              href={"/PlaceTheBooking/Delivery/three_four_day"}
              icon={"/icons/3-4_Day.png"}
              title="3-4 Day"
              description="Standard delivery at a lower cost"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DeliveryOption({ icon, title, description, href }) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:scale-105">
        <Image src={icon} className="size-36" width={100} height={100} alt="" />
        <h2 className="text-xl font-semibold mt-4 mb-2 text-gray-800">
          {title}
        </h2>
        <p className="text-center text-gray-600">{description}</p>
        <Button className="mt-4 w-full" auto color="primary">
          Book Now
        </Button>
      </div>
    </Link>
  );
}
