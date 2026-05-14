export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Mandi Price Aggregator</h1>
      <p className="mt-4 max-w-md text-zinc-600 dark:text-zinc-400">
        Real-time agricultural commodity prices across nearby mandis. UI coming Day 2.
      </p>
      <p className="mt-8 text-sm text-zinc-500">
        Day 1 scaffold: data pipeline ready. See <code className="font-mono">README.md</code>.
      </p>
    </main>
  );
}
