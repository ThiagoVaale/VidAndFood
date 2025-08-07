import { useState } from "react";
import { CheckBoxOption } from "../types/FilterTypes";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from '@heroicons/react/16/solid'

interface CheckBoxFilterProps {
    options: CheckBoxOption[]
    filterId: string;
    onFilterChange?: (filterId: string, value: CheckBoxOption[]) => void;
}

const CheckBoxFilter: React.FC<CheckBoxFilterProps> = ({
    options,
    filterId,
    onFilterChange
}) => {
    const [enabledOption, setEnabledOption] = useState<CheckBoxOption[]>(
        options.filter(options => options.checked)
    )

   const handleCheckBoxChange = (option: CheckBoxOption, checked: boolean) => {
    const updatedOptions = checked ? [...enabledOption, option] : enabledOption.filter(selected => selected.id !== option.id)

    setEnabledOption(updatedOptions);
    onFilterChange?.(filterId, updatedOptions);
   }

   return (
    <div>
        {options.map((option) => (
            <div key={option.id}>
                <Checkbox 
                checked={enabledOption.some(selected => selected.id === option.id)} 
                onChange={(checked) => handleCheckBoxChange(option, checked)}
                >
                    <CheckIcon/>
                </Checkbox>
                <label>{option.label}</label>
            </div>
        ))}
    </div>
   )
}

export default CheckBoxFilter;