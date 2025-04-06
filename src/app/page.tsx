import { PaperSearchBox } from "@/components/PaperSearchBox";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-24">
      <h1 className="text-4xl font-bold">Welcome to OpenPapers</h1>
      <p className="mt-4 text-lg">An open platform for all exam papers</p>
      <div className="mt-8">
        <PaperSearchBox />
      </div>
    </main>
  );
}
