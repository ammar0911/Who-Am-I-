import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';

interface Calendar {
  id: string;
  summary: string;
}

interface CalendarSelectionProps {
  availableCalendars: Calendar[];
  selectedCalendarIds: string[];
  onCalendarSelectionChange: (selectedIds: string[]) => void;
}

const CalendarSelection: React.FC<CalendarSelectionProps> = ({
  availableCalendars,
  selectedCalendarIds,
  onCalendarSelectionChange,
}) => {
  const { t } = useContext(AppContext);
  const [currentSelectedIds, setCurrentSelectedIds] =
    useState<string[]>(selectedCalendarIds);

  useEffect(() => {
    setCurrentSelectedIds(selectedCalendarIds);
  }, [selectedCalendarIds]);

  const handleCheckboxChange = (calendarId: string, isChecked: boolean) => {
    let newSelectedIds;
    if (isChecked) {
      newSelectedIds = [...currentSelectedIds, calendarId];
    } else {
      newSelectedIds = currentSelectedIds.filter((id) => id !== calendarId);
    }
    setCurrentSelectedIds(newSelectedIds);
    onCalendarSelectionChange(newSelectedIds);
  };

  return (
    <div className="space-y-2">
      {availableCalendars.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('noCalendarsAvailable')}
        </p>
      ) : (
        <ul className="space-y-2">
          {availableCalendars.map((calendar) => (
            <li key={calendar.id} className="flex items-center">
              <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={currentSelectedIds.includes(calendar.id)}
                  onChange={(e) =>
                    handleCheckboxChange(calendar.id, e.target.checked)
                  }
                />
                <span>{calendar.summary}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarSelection;
