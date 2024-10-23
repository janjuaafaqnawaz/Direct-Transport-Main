"use client";

import { Group, Paper, Text, ThemeIcon, SimpleGrid } from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";
import classes from "./Stats.module.css";
import useAdminContext from "@/context/AdminProvider";
import Link from "next/link";
import { useMemo } from "react";

export default function StatsGridIcons() {
  const { allBookings, allUsers, allDrivers, totalBookings } =
    useAdminContext();

  const currentDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" })
  );

  const currentMonthStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const nextMonthStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  const getCurrentMonthName = () => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      timeZone: "Australia/Sydney",
    }).format(currentMonthStartDate);
  };

  const getCurrentMonthBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt.seconds * 1000);
      return (
        bookingDate >= currentMonthStartDate && bookingDate < nextMonthStartDate
      );
    }).length;
  }, [allBookings, currentMonthStartDate, nextMonthStartDate]);

  const data = [
    {
      title: "Bookings",
      value: totalBookings,
      diff: 34,
      href: "/admin/Manage/Bookings",
    },
    {
      title: "Users",
      value: allUsers.length,
      diff: 13,
      href: "/admin/Manage/Users",
    },
    {
      title: "Drivers",
      value: allDrivers.length,
      diff: 18,
      href: "/admin/Manage/Drivers",
    },
  ];

  const stats = data.map((stat) => {
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Link href={stat.href}>
          <Group justify="apart">
            <div>
              <Text
                c="dimmed"
                tt="uppercase"
                fw={700}
                fz="xs"
                className={classes.label}
              >
                {stat.title}
              </Text>
              <Text fw={700} fz="xl">
                {stat.value}
              </Text>
            </div>
            <ThemeIcon
              color="gray"
              variant="light"
              style={{
                color:
                  stat.diff > 0
                    ? "var(--mantine-color-teal-6)"
                    : "var(--mantine-color-red-6)",
              }}
              size={38}
              radius="md"
            >
              <DiffIcon size="1.8rem" stroke={1.5} />
            </ThemeIcon>
          </Group>
          {/* <Text c="dimmed" fz="sm" mt="md">
            <Text component="span" c={stat.diff > 0 ? "teal" : "red"} fw={700}>
              {stat.diff}%
            </Text>{" "}
            {stat.diff > 0 ? "increase" : "decrease"} compared to last month
          </Text> */}
        </Link>
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      <SimpleGrid className="max-w-[97vw] ml-[1.2vw]" cols={{ base: 1, sm: 3 }}>
        {stats}
      </SimpleGrid>
    </div>
  );
}
