export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center h-screen p-24 dotted-bg">
      <h1 className="text-4xl font-bold">Loading...</h1>
      <p className="mt-4 text-lg">Please wait while we load the content.</p>
      <div className="mt-8">{/* Add your custom loading content here */}</div>
    </main>
  );
}