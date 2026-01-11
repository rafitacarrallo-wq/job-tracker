import { useState, useMemo, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  format,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";

export type CalendarView = "day" | "3day" | "week" | "month";

interface UseCalendarOptions {
  initialDate?: Date;
  initialView?: CalendarView;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export function useCalendar(options: UseCalendarOptions = {}) {
  const {
    initialDate = new Date(),
    initialView = "month",
    weekStartsOn = 1, // Monday
  } = options;

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<CalendarView>(initialView);

  const navigate = useCallback(
    (direction: "prev" | "next" | "today") => {
      if (direction === "today") {
        setCurrentDate(new Date());
        return;
      }

      setCurrentDate((date) => {
        switch (view) {
          case "month":
            return direction === "next" ? addMonths(date, 1) : subMonths(date, 1);
          case "week":
            return direction === "next" ? addWeeks(date, 1) : subWeeks(date, 1);
          case "3day":
            return direction === "next" ? addDays(date, 3) : subDays(date, 3);
          case "day":
            return direction === "next" ? addDays(date, 1) : subDays(date, 1);
          default:
            return date;
        }
      });
    },
    [view]
  );

  const visibleDates = useMemo(() => {
    switch (view) {
      case "month": {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
      }
      case "week": {
        const weekStart = startOfWeek(currentDate, { weekStartsOn });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn });
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      }
      case "3day": {
        return eachDayOfInterval({
          start: currentDate,
          end: addDays(currentDate, 2),
        });
      }
      case "day": {
        return [currentDate];
      }
      default:
        return [];
    }
  }, [currentDate, view, weekStartsOn]);

  const dateRange = useMemo(() => {
    if (visibleDates.length === 0) {
      return { start: currentDate, end: currentDate };
    }
    return {
      start: visibleDates[0],
      end: visibleDates[visibleDates.length - 1],
    };
  }, [visibleDates, currentDate]);

  const headerLabel = useMemo(() => {
    switch (view) {
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "week": {
        const start = visibleDates[0];
        const end = visibleDates[visibleDates.length - 1];
        if (start && end) {
          if (isSameMonth(start, end)) {
            return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`;
          }
          return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
        }
        return format(currentDate, "MMMM yyyy");
      }
      case "3day": {
        const start = visibleDates[0];
        const end = visibleDates[visibleDates.length - 1];
        if (start && end) {
          if (isSameMonth(start, end)) {
            return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`;
          }
          return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
        }
        return format(currentDate, "MMMM d, yyyy");
      }
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      default:
        return "";
    }
  }, [view, currentDate, visibleDates]);

  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  return {
    currentDate,
    view,
    setView,
    navigate,
    goToDate,
    visibleDates,
    dateRange,
    headerLabel,
    // Utility functions
    isSameDay,
    isSameMonth: (date: Date) => isSameMonth(date, currentDate),
    isToday,
  };
}
