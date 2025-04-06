export default function NotFound() {
  return (
    <main className="flex flex-col items-center p-24">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">Sorry, the page you are looking for does not exist.</p>
      <div className="mt-8">{/* Add your custom 404 content here */}</div>
    </main>
  );
}
