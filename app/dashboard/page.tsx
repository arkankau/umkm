import React from 'react'
import NavDash from '@/components/dashboardnav'
import Link from "next/link";
import Card from '@/components/card';

const Dashboard = () => {
  return (
    <div>
      <NavDash/>
      <div className="profile flex gap-3  items-center justify-start px-15">
        <div className="image rounded-full  bg-gray-500 w-20 h-20"></div>
        <div className="information  font-mont">
            <h2 className='text-lg font-bold'>Username</h2>
            <h3 className='text-sm '>user@gmail.com</h3>
            <Link className='px-4 py-1 bg-button text-white rounded-lg text-xs' href='/settings'>Settings</Link>
        </div>
      </div>
      <div className="dashboard grid grid-cols-3 gap-6 px-15 py-8">
        <Card name='Cake Loe' url='www.onestop.com/cakeloe' preview='/image.png'/>
        <Card name='Coffee Shop' url='www.onestop.com/coffee' preview='/image.png'/>
        <div className='flex flex-col font-inter justify-center items-center w-[15rem] h-[12rem] bg-[#E9E4DA] rounded-xl border-2 border-dashed border-gray-400 cursor-pointer hover:bg-gray-200 transition-colors'>
          <div className='text-6xl text-gray-500 mb-2'>+</div>
          <p className='text-gray-600 font-medium'>Add New</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
