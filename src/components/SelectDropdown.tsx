import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";

interface ISelectDropdownProps {
  options: { label: string; value: string }[];
}

export function SelectDropdown({ options }: ISelectDropdownProps) {
  return (
    <Select.Root>
      <Select.Trigger className="inline-flex items-center justify-between w-full h-full px-4 py-2 text-sm font-medium bg-white border rounded-md shadow-sm">
        <Select.Value placeholder="Select the Exam Type" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="w-full mt-1 bg-white border rounded-md shadow-lg">
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="relative flex items-center px-4 py-2 text-sm cursor-pointer"
              >
                {option.label}
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
