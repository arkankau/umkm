import React from 'react'
import NavDash from '@/components/dashboardnav'
import Link from "next/link";
import Card from '@/components/card';

const Dashboard = () => {
  return (
    <div>
      <NavDash/>
      <div className="profile flex flex-col sm:flex-row gap-4 sm:gap-3 items-center sm:items-center justify-center sm:justify-start px-4 sm:px-8 lg:px-15 py-6">
        <div className="image rounded-full bg-gray-500 w-20 h-20"></div>
        <div className="information font-mont text-center sm:text-left">
            <h2 className='text-lg font-bold'>Username</h2>
            <h3 className='text-sm mb-2 sm:mb-1'>user@gmail.com</h3>
            <Link className='px-4 py-1 bg-button text-white rounded-lg text-xs hover:bg-black transition-colors' href='/settings'>Settings</Link>
        </div>
      </div>
      <div className="dashboard grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-8 lg:px-15 py-8">
        <Card name='Cake Loe' url='www.onestop.com/cakeloe' preview='/image.png'/>
        <Card name='Coffee Shop' url='www.onestop.com/coffee' preview='/image.png'/>
        <Card name='Bakery Store' url='www.onestop.com/bakery' preview='/image.png'/>
        <Link href='/id/create-new' className='group cursor-pointer w-[15rem] h-[16rem] bg-white/60 backdrop-blur-sm rounded-2xl relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-dashed border-gray-300/50 flex flex-col justify-center items-center hover:border-purple-300/50 hover:bg-purple-50/30'>
          <div className='text-4xl text-gray-400 mb-3 group-hover:text-purple-400 transition-colors'>+</div>
          <p className='text-gray-500 font-inter font-medium group-hover:text-purple-600 transition-colors'>Add New</p>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
