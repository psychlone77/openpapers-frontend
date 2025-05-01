"use client";

import { useState } from "react";
import { SearchableDropdown } from "./SearchableDropdown";
import { SelectDropdown } from "./SelectDropdown";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export function PaperSearchBox() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [paperType, setPaperType] = useState("");

  const subjects = [
    { label: "Physics", value: "Physics" },
    { label: "Biology", value: "Biology" },
    { label: "Chemistry", value: "Chemistry" },
    { label: "Mathematics", value: "Mathematics" },
  ];

  const years = [
    { label: "2021", value: "2021" },
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
  ];

  const paperTypes = [
    { label: "MCQ", value: "MCQ" },
    { label: "Essay", value: "Essay" },
    { label: "Practical", value: "Practical" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center p-4 bg-background-light rounded-2xl shadow-md">
      <SearchableDropdown
        options={subjects}
        value={subject}
        setValue={setSubject}
        placeholder="Select a subject"
      />
      <SearchableDropdown
        options={years}
        value={year}
        setValue={setYear}
        placeholder="Select year"
      />
      <SearchableDropdown
        options={paperTypes}
        value={paperType}
        setValue={setPaperType}
        placeholder="Select Exam type"
      />
      <button onClick={() => router.push("/papers/physics/2021/mcq")} className="flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary-light px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer transition duration-200 ease-in-out">
        Search Papers
        <ArrowRightIcon />
      </button>
    </div>
  );
}
