import { PaperSearchBox } from "@/components/PaperSearchBox";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-24">
      <div className="-z-10 fixed top-0 left-0 bottom-0 h-svh w-screen dotted-bg"></div>
      <h1 className="text-4xl font-bold">Welcome to OpenPapers</h1>
      <p className="mt-4 text-lg">An open platform for all exam papers</p>
      <div className="mt-16">
        <PaperSearchBox />
      </div>
    </main>
  );
}
