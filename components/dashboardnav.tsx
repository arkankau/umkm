import React from 'react'
import Link from "next/link";

const NavDash = () => {
  return (
    <div className='py-10 px-15 font-mont flex items-center relative'>
      <Link className=' text-2xl font-bold hover:text-[#C6AFFF] transition-colors duration-300' href=''>OneStopUMKM</Link>
      <Link href='/dashboard' className='ml-auto px-7 bg-button text-white py-2 rounded-lg text-md hover:bg-black transition-colors duration-300'>
        Profile
      </Link>
    </div>
  )
}

export default NavDash
