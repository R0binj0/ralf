import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link href="/weather">Weather</Link>
      <Link href="/map">Map</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/monsters">Monsters</Link>
      <Link href="/others">Others</Link>
    </div>
  );
}
