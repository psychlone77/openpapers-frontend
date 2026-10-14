"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectItem, Button, Tile } from "./carbon";
import { ArrowRight } from "./carbon";

export function PaperSearchBox() {
  const router = useRouter();
  const [subject, setSubject] = useState("Physics");
  const [year, setYear] = useState("2016");
  const [paperType, setPaperType] = useState("MCQ");

  const subjects = ["Physics", "Biology", "Chemistry", "Mathematics"];
  const years = [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
  ];
  const paperTypes = ["MCQ", "Essay", "Practical"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !year || !paperType) return;
    router.push(`/papers/${subject.toLowerCase()}/${year}/${paperType.toLowerCase()}`);
  };

  return (
    <Tile
      style={{
        padding: "2rem",
        border: "1px solid var(--cds-border-subtle-01)",
        backgroundColor: "var(--cds-layer-01)",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <form onSubmit={handleSearch}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.5rem",
            alignItems: "end",
          }}
        >
          <Select
            id="subject-select"
            labelText="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map((s) => (
              <SelectItem key={s} value={s} text={s} />
            ))}
          </Select>

          <Select
            id="year-select"
            labelText="Examination Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {years.map((y) => (
              <SelectItem key={y} value={y} text={y} />
            ))}
          </Select>

          <Select
            id="type-select"
            labelText="Paper Type"
            value={paperType}
            onChange={(e) => setPaperType(e.target.value)}
          >
            {paperTypes.map((t) => (
              <SelectItem key={t} value={t} text={t} />
            ))}
          </Select>

          <div>
            <Button
              type="submit"
              renderIcon={ArrowRight}
              size="md"
              style={{ width: "100%", height: "40px" }}
            >
              Search Papers
            </Button>
          </div>
        </div>
      </form>
    </Tile>
  );
}

export default PaperSearchBox;
