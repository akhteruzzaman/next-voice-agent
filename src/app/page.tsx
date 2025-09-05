import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>

      <nav className="p-4 bg-gray-100 flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/count">Counter</Link>
      </nav>

      <h1>Hello Next.js 👋</h1>
      <p>It works!</p>

    </main>
  );
}
