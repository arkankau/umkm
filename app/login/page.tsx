import React from 'react'
import Link from "next/link";

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col font-inter'>
      <div className="px-15 pt-10 relative z-10">
        <Link href='/'><h1 className='font-mont text-2xl font-bold '>OneStopUMKM</h1></Link>
      </div>
      <div className="section flex flex-col -mt-3 items-center justify-center flex-1 gap-3 px-15">
            <h1 className='font-bold font-mont text-center text-2xl'>Welcome Back</h1>
            <div className="flex flex-col gap-2 mx-auto">
                <h3 className='text-sm'>Email</h3>
                <input className='bg-white border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm' type="email" />
            </div>
            <div className="flex flex-col gap-2 mx-auto">
                <h3 className='text-sm'>Password</h3>
                <input className='bg-white border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm' type="email" />
            </div>
            <div className="flex flex-col mt-4 mx-auto">
                <h3 className='bg-button text-white flex items-center text-sm justify-center font-mont w-[19rem] text-center h-[2rem] rounded-sm'>Continue</h3>
            </div>
            <h3 className='text-center font-mont text-sm'>OR</h3>
            <button className='bg-[#A8CBFF] flex flex-col justify-center items-center font-mont text-sm mx-auto w-[19rem] h-[2rem] rounded-sm'>
                Continue with Google
            </button>
            <h3 className='text-xs font-mont text-center'>Don't have an account? <Link className='text-blue-400' href='/signup'>Sign up</Link></h3>
        </div>
    </div>
  )
}

export default Login
