import React from 'react'
import Link from "next/link";

const NavDash = () => {
  return (
    <div className='py-10 px-15 font-mont flex items-center relative'>
      <Link className=' text-2xl font-bold hover:text-green-600 transition-colors duration-300' href=''><span className="text-black">Untuk Mu</span> <span className="text-yellow-500">Karya Mu</span></Link>
      <div className='ml-auto flex items-center gap-4'>
        <Link href='/id/create-new?section=chatbot' className='px-7 bg-yellow-500 text-black py-2 rounded-lg text-md hover:bg-yellow-600 transition-colors duration-300'>
          Marketing AI
        </Link>
        <Link href='/dashboard' className='px-7 bg-green-600 text-white py-2 rounded-lg text-md hover:bg-green-700 transition-colors duration-300'>
          Profile
        </Link>
      </div>
    </div>
  )
}

export default NavDash
