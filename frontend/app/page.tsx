import Link from "next/link";


export default function Home() {
 
  return (
    <Link href="/login" className="rounded bg-blue-600 px-4 py-2 text-white">
      Go to Login
    </Link>
  );
}
