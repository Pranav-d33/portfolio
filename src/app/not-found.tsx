export default function NotFound() {
  return (
    <main className="min-h-[100dvh] overflow-hidden">
      <img
        src="/404-bg.webp"
        alt="404 — page not found"
        className="h-[100dvh] w-full object-cover"
        draggable={false}
      />
    </main>
  );
}