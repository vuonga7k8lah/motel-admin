import * as React from "react";
import { Loader2Icon } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Option {
    label: string;
    value: string;
}

interface SelectComponentProps {
    options?: Option[];
    currentData?: any;
    placeholder?: string;
    onChange: (value: string) => void;
}

export function SelectComponent({
    options,
    currentData,
    placeholder,
    onChange,
}: SelectComponentProps) {
    const [selectedValue, setSelectedValue] = React.useState(currentData);

    React.useEffect(() => {
        setSelectedValue(currentData);
    }, [currentData]);

    const handleChange = (value: string) => {
        setSelectedValue(value);
        onChange(value);
    };

    return (
        <Select onValueChange={handleChange} value={String(selectedValue)}>
            <SelectTrigger className="text-2xl">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options && options.length > 0 ? (
                    <SelectGroup>
                        {options.map((option, index) => (
                            <SelectItem key={index} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                ) : (
                    <div className="flex-center gap-4 p-4 text-center text-primary">
                        <Loader2Icon /> 로딩 중...
                    </div>
                )}
            </SelectContent>
        </Select>
    );
}
