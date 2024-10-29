import { useState, useEffect } from "react";
const ClientDateTooltip = ({ value }: { value: any }) => {
    const [formattedDate, setFormattedDate] = useState("");

    useEffect(() => {
        if (value) {
            const date = new Date(value).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            setFormattedDate(date);
        }
    }, [value]);

    return <span>{formattedDate}</span>;
};

export default ClientDateTooltip