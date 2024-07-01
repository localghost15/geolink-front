import React from "react";
import { DatePicker } from "antd";
import moment from "moment";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";

const DateSelect = ({ value, onChange, error }) => {
    const [date, setDate] = React.useState(value ? moment(value, "YYYY-MM-DD") : null);

    const handleDateChange = (date, dateString) => {
        setDate(date);
        onChange(dateString);
    };

    return (
        <div className="w-max">
            <DatePicker
                format="YYYY-MM-DD"
                value={date}
                onChange={handleDateChange}
                allowClear
                locale={{
                    lang: {
                        locale: "uz",
                    },
                }}
                className="w-full"
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
    );
};

export default DateSelect;
