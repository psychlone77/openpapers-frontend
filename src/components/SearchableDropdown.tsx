"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { ComboboxProvider, Combobox, ComboboxList, ComboboxItem } from "@ariakit/react";
import { ChevronDownIcon, MagnifyingGlassIcon, CheckIcon } from "@radix-ui/react-icons";
import { startTransition, useMemo, useState } from "react";

interface ISearchableDropdownProps {
  options: { label: string; value: string }[];
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}

export function SearchableDropdown({ options, value, setValue, placeholder = "Select an option" }: ISearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const matches = useMemo(() => {
    const filteredSubjects = options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption && !filteredSubjects.includes(selectedOption)) {
      filteredSubjects.push(selectedOption);
    }

    return filteredSubjects;
  }, [searchValue, value]);

  return (
    <RadixSelect.Root value={value} onValueChange={setValue} open={open} onOpenChange={setOpen}>
      <ComboboxProvider
        open={open}
        setOpen={setOpen}
        resetValueOnHide
        includesBaseElement={false}
        setValue={(value) => {
          startTransition(() => {
            setSearchValue(value);
          });
        }}
      >
        <RadixSelect.Trigger
          aria-label="Subject"
          className="flex items-center justify-between min-w-52 h-full px-4 py-2 text-sm font-medium bg-background border border-secondary rounded-md shadow-sm hover:bg-background-light"
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="ml-2">
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Content
          role="dialog"
          aria-label="Subjects"
          className="z-10 relative mt-2 bg-background border border-accent rounded-md shadow-lg p-2"
          position="popper"
          alignOffset={-16}
          sideOffset={-4}
        >
          <div className="relative flex items-center mb-2">
            <MagnifyingGlassIcon className="absolute left-3" />
            <Combobox
              autoSelect
              placeholder="Search subjects"
              className="w-full pl-10 pr-4 py-2 text-sm border border-accent-light rounded-md"
              onBlurCapture={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </div>
          <ComboboxList className="max-h-60 overflow-auto">
            {matches.map(({ label, value }) => (
              <RadixSelect.Item
                key={value}
                value={value}
                asChild
                className="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-background-light rounded-md data-active-item:bg-background-light"
              >
                <ComboboxItem>
                  <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="ml-2 text-primary">
                    <CheckIcon />
                  </RadixSelect.ItemIndicator>
                </ComboboxItem>
              </RadixSelect.Item>
            ))}
          </ComboboxList>
        </RadixSelect.Content>
      </ComboboxProvider>
    </RadixSelect.Root>
  );
}
