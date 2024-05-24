import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import uzLocale from "date-fns/locale/uz";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";

export default function DateSelect({ value, onChange }) {
    const [date, setDate] = React.useState(value ? new Date(value) : new Date());
    const locale = uzLocale;

    React.useEffect(() => {
        const initialDate = format(new Date(), 'yyyy-MM-dd');
        onChange(initialDate);
    }, []);

    const handleDateChange = (date) => {
        setDate(date);
        const formattedDate = format(date, 'yyyy-MM-dd');
        onChange(formattedDate);
    };

    return (
        <div className="">
            <DatePicker
                showIcon
                icon={<CalendarIcon />}
                customInput={<Input value={format(date, 'P')} label="Тугилган куни" />}
                dateFormat="P"
                onChange={handleDateChange}
                locale={locale}
                selected={date}
            />
        </div>
    );
}
