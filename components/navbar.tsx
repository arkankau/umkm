import React from 'react'
import Link from "next/link";

const Navbar = () => {
  return (
    <div className='py-10 px-15 font-mont flex items-center relative'>
      <Link className=' text-xl font-bold hover:text-[#C6AFFF] transition-colors duration-300' href=''>OneStopUMKM</Link>
      <div className='flex items-center  gap-15 absolute left-1/2 transform -translate-x-1/2'>
        <Link className='mx-4 font-normal text-md hover:text-[#C6AFFF] transition-colors duration-300' href='/'>Home</Link>
        <Link className='mx-4 text-md hover:text-[#C6AFFF] transition-colors duration-300' href='/features'>Features</Link>
        <Link className='mx-4 text-md hover:text-[#C6AFFF] transition-colors duration-300' href='/team'>Team</Link>
      </div>
      <Link href='/login' className='ml-auto px-7 bg-button text-white py-2 rounded-lg text-md hover:bg-opacity-80 hover:scale-105 transition-all duration-300'>
        Login
      </Link>
    </div>
  )
}

export default Navbar
