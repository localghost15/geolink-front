import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import uzLocale from "date-fns/locale/uz";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";

export default function DateSelect({ value, onChange, error }) {
    const [date, setDate] = React.useState(value ? new Date(value) : new Date());
    const locale = uzLocale;

    React.useEffect(() => {
        const initialDate = format(new Date(), 'yyyy-MM-dd');
        onChange(initialDate);
    }, []);

    const handleDateChange = (date) => {
        // Check if the date is null, indicating the input field has been cleared
        if (date === null) {
            setDate(null);
            onChange(""); // Notify that the date has been cleared
        } else {
            // If the date is not null, proceed as usual
            setDate(date);
            const formattedDate = format(date, 'yyyy-MM-dd');
            onChange(formattedDate);
        }
    };

    return (
        <div className="w-max">
            <DatePicker
                // showIcon
                // icon={<CalendarIcon />}
                customInput={<Input value={format(new Date(date), 'P')} label="Тугилган куни" error={error} />} // Передача ошибки в компонент Input
                dateFormat="P"
                onChange={handleDateChange}
                locale={locale}
                isClearable
                selected={date}
            />
        </div>
    );
}

