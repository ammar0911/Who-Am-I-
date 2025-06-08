"use client";
import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../contexts/AppContext";
// import { InfoOutlined } from "@mui/icons-material";
import { translations } from "../app/translations";

type Level = "high" | "medium" | "low";
type ColorScheme = {
  light: string;
  dark: string;
};

const colors: Record<Level, ColorScheme> = {
  high: { light: "#6EE7B7", dark: "#34D399" },
  medium: { light: "#FCD34D", dark: "#FBBF24" },
  low: { light: "#D1D5DB", dark: "#4B5563" },
};

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

interface CalendarEvent {
  day: string;
  start: string;
  end: string;
}

interface PredictedAvailability {
  [key: string]: number[];
}

type SlotInfo =
  | { type: "calendar"; tooltip: string }
  | { type: "prediction"; level: Level; tooltip: string };

export interface WeeklyAvailabilityViewProps {
  predictedAvailability: PredictedAvailability;
  calendarEvents: CalendarEvent[];
}

export const WeeklyAvailabilityView: React.FC<WeeklyAvailabilityViewProps> = ({
  predictedAvailability,
  calendarEvents,
}) => {
  const { t, mode } = useContext(AppContext);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const germanDays: string[] = translations["de"]["daysOfWeek"];

  const isSlotBooked = (day: string, timeSlot: string): boolean => {
    const slotIndex = timeSlots.indexOf(timeSlot);
    const dayIndex = germanDays.indexOf(day);
    const englishDay = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][dayIndex];

    for (const event of calendarEvents) {
      if (event.day === englishDay) {
        const startIndex = timeSlots.indexOf(event.start);
        const endIndex = timeSlots.indexOf(event.end);
        if (slotIndex >= startIndex && slotIndex < endIndex) return true;
      }
    }
    return false;
  };

  const getSlotInfo = (
    day: string,
    timeSlot: string,
    index: number
  ): SlotInfo => {
    if (isSlotBooked(day, timeSlot))
      return { type: "calendar", tooltip: t("tooltipNotAvailableCalendar") };

    const dayIndex = germanDays.indexOf(day);
    const englishDay = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][dayIndex];

    if (!predictedAvailability || !predictedAvailability[englishDay]) {
      return {
        type: "prediction",
        level: "low",
        tooltip: t("tooltipLikelyNotAvailable"),
      };
    }

    const prob = predictedAvailability[englishDay][index];
    if (prob > 0.7) {
      return {
        type: "prediction",
        level: "high",
        tooltip: t("tooltipLikelyAvailable"),
      };
    }
    if (prob > 0.3) {
      return {
        type: "prediction",
        level: "medium",
        tooltip: t("tooltipPossiblyAvailable"),
      };
    }
    return {
      type: "prediction",
      level: "low",
      tooltip: t("tooltipLikelyNotAvailable"),
    };
  };

  const getStripeBg = (level: Level): string => {
    const color = mode === "light" ? colors[level].light : colors[level].dark;
    const bgColor =
      mode === "light" ? "rgba(255,255,255,0.7)" : "rgba(31,41,55,0.7)";
    return `repeating-linear-gradient(-45deg, ${color}, ${color} 4px, ${bgColor} 4px, ${bgColor} 8px)`;
  };

  const dayAbbreviations = t("dayAbbreviations");
  const dayIndex = (now.getDay() + 6) % 7;
  const minutesSinceStart = (now.getHours() - 8) * 60 + now.getMinutes();
  const totalMinutes = (19 - 8) * 60;
  const topPercentage = Math.max(
    0,
    Math.min(100, (minutesSinceStart / totalMinutes) * 100)
  );
  const isWeekend = dayIndex >= 6;
  const showIndicator =
    now.getHours() >= 8 && now.getHours() < 19 && !isWeekend;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {t("weeklyAvailability")}
      </h3>
      {/* {isWeekend && (
        <div className="mb-4 p-2 text-sm text-blue-800 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 rounded-md flex items-center">
          <InfoOutlined className="w-5 h-5 mr-2" />
          {t("weekendNotice")}
        </div>
      )} */}
      <div className="flex">
        <div className="flex flex-col pt-8 pr-2">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="h-7 text-right text-xs text-gray-500 dark:text-gray-400">
              {time}
            </div>
          ))}
        </div>
        <div className="flex-grow grid grid-cols-6 gap-1 relative">
          {germanDays.map((day: string, d_index: number) => (
            <div
              key={day}
              className={`rounded p-1 ${
                day === germanDays[dayIndex]
                  ? "bg-indigo-50 dark:bg-indigo-900/50"
                  : "bg-gray-50 dark:bg-gray-900/50"
              }`}>
              <p className="text-center font-bold text-xs text-gray-600 dark:text-gray-300 mb-1">
                {dayAbbreviations[d_index]}
              </p>
              <div className="grid grid-cols-1 gap-0.5">
                {timeSlots.map((slot, index) => {
                  const slotInfo = getSlotInfo(day, slot, index);
                  const style =
                    slotInfo.type === "calendar"
                      ? { backgroundColor: "#64727f" }
                      : {
                          backgroundImage: getStripeBg(slotInfo.level),
                          backgroundSize: "10px 10px",
                        };
                  return (
                    <div key={index} className="h-7 rounded relative group">
                      <div
                        className="w-full h-full rounded"
                        style={style}></div>
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max p-2 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {slot}: {slotInfo.tooltip}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {showIndicator && (
            <div className="absolute w-full h-full top-0 left-0 pointer-events-none pt-7 pl-1">
              <div className="relative h-full w-full">
                <div
                  style={{
                    top: `${topPercentage}%`,
                    left: `calc(${(100 / 6) * dayIndex}%)`,
                    width: `calc(${100 / 6}%)`,
                  }}
                  className="absolute h-0.5">
                  <div className="relative h-full w-full">
                    <div className="absolute w-full h-full bg-red-500 top-0 left-0 px-1">
                      <div className="w-full h-full bg-red-500 relative">
                        <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 border-t dark:border-gray-700 pt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="font-bold">{t("legend")}</div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-2 bg-[#64727f]"></div>
          {t("legendNotAvailableCalendar")}
        </div>
        <div className="flex items-center">
          <div
            style={{
              backgroundImage: getStripeBg("high"),
              backgroundSize: "10px 10px",
            }}
            className="w-4 h-4 rounded-sm mr-2"
          />
          {t("legendLikelyAvailable")}
        </div>
        <div className="flex items-center">
          <div
            style={{
              backgroundImage: getStripeBg("medium"),
              backgroundSize: "10px 10px",
            }}
            className="w-4 h-4 rounded-sm mr-2"
          />
          {t("legendPossiblyAvailable")}
        </div>
        <div className="flex items-center">
          <div
            style={{
              backgroundImage: getStripeBg("low"),
              backgroundSize: "10px 10px",
            }}
            className="w-4 h-4 rounded-sm mr-2"
          />
          {t("legendLikelyNotAvailable")}
        </div>
      </div>
    </div>
  );
};
