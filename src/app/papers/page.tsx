import { PaperSearchBox } from "@/components/PaperSearchBox";

export default function PapersPage() {
  return (
    <main className="flex flex-col items-center p-24">
      <h1 className="text-4xl font-bold">Papers</h1>
      <p className="mt-4 text-lg">Search and view exam papers</p>
      <div className="mt-8">
        <PaperSearchBox />
      </div>
    </main>
  );
}
