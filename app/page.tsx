import Image from "next/image";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative z-10">
        <Navbar/>
      </div>
      <div className="hero px-15 flex flex-col items-center justify-center min-h-screen absolute inset-0 text-center">
        <h1 className="font-mont font-bold text-5xl leading-relaxed">Create a website for your <br /> business in <span className="bg-[#C6AFFF] px-1">3 minutes</span></h1>
        <Link href="/login" className="bg-button font-mont mt-3 rounded-4xl px-10 text-white py-1 text-lg hover:scale-105 transition-all duration-300 ease-in-out relative overflow-hidden group">
          <span className="absolute inset-0 bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out rounded-4xl"></span>
          <span className="relative z-10">Get Started</span>
        </Link>
      </div>
    </div>
  );
}
