import React from "react";
import { Input, Popover, PopoverHandler, PopoverContent, Select } from "@material-tailwind/react";
import { format} from "date-fns";
import uzLocale  from "date-fns/locale/uz";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
 
export default function DatePicker({ value, onChange }) {
  const [date, setDate] = React.useState(new Date());
  const locale = uzLocale;
  const handleDateChange = (newDate) => {
    setDate(newDate);
    onChange(format(newDate, "yyyy-MM-dd")); // Преобразование даты в строку
};

const handleMonthChange = (e) => {
  const selectedMonth = parseInt(e.target.value);
  const newDate = new Date(date);
  newDate.setMonth(selectedMonth);
  setDate(newDate);
  onChange(format(newDate, "yyyy-MM-dd"));
};

const handleYearChange = (e) => {
  const selectedYear = parseInt(e.target.value);
  const newDate = new Date(date);
  newDate.setFullYear(selectedYear);
  setDate(newDate);
  onChange(format(newDate, "yyyy-MM-dd"));
};

  return (
    <div className="">
      <Popover placement="bottom">
        
        <PopoverHandler>
          <Input 
            label="Cана:"
            onChange={() => null}
            value={date ? format(date, "d MMM yyyy", { locale }) : ""}
          />
        </PopoverHandler>
            
        <PopoverContent className="z-20">
          <DayPicker 
          captionLayout="dropdown-buttons" fromYear={1950} toYear={2024}
          locale={locale}
            mode="single"
            selected={date}
            onSelect={handleDateChange} 
            showOutsideDays
            className="border-0"
            classNames={{
              caption: 'flex justify-between pt-1 relative items-center gap-2 px-2',
              caption_label: 'text-sm font-medium capitalize',
              caption_dropdowns: 'flex justify-center gap-2',
              nav: "flex items-center",
              nav_button:
                "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
              nav_button_previous: "absolute left-1.5",
              nav_button_next: "absolute right-1.5",
              table: "w-full border-collapse",
              head_row: "flex font-medium text-gray-900",
              head_cell: "m-0.5 w-9 font-normal text-sm",
              row: "flex w-full mt-2",
              cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal",
              day_range_end: "day-range-end",
              day_selected:
                "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
              day_today: "rounded-md bg-gray-200 text-gray-900",
              day_outside:
                "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
              day_disabled: "text-gray-500 opacity-50",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: ({ ...props }) => (
                <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
              ),
              IconRight: ({ ...props }) => (
                <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
              ),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}