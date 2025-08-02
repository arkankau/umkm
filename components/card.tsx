"use client"
import React from 'react'
import { useState } from 'react'
import Image from 'next/image'

const Card = ({name, url, preview}: {name: string, url: string, preview: string}) => {
  return (
    <div className='group cursor-pointer w-[15rem] h-[16rem] bg-white/80 backdrop-blur-sm rounded-2xl relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50'>
      {/* Edit button */}
      <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
        <div className='bg-black/10 hover:bg-black/20 rounded-full p-2 backdrop-blur-sm transition-colors'>
          <Image src='/edit.svg' alt='Edit' width={14} height={14} className='opacity-70' />
        </div>
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col h-full'>
        {/* Header */}
        <div className='mb-4'>
          <h3 className='font-mont font-semibold text-xl text-gray-800 mb-1 leading-tight'>{name}</h3>
          <p className='text-xs text-gray-500 font-inter'>{url}</p>
        </div>

        {/* Preview Image */}
        <div className='flex-1 flex items-center justify-center'>
          <div className='relative w-full h-32 rounded-lg overflow-hidden bg-gray-100/50'>
            <Image 
              src={preview} 
              alt={name} 
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-300'
            />
          </div>
        </div>

        {/* Status indicator */}
        <div className='mt-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
            <span className='text-xs text-gray-500 font-inter'>Live</span>
          </div>
          <div className='text-xs text-gray-400 font-inter'>Updated 2h ago</div>
        </div>
      </div>
    </div>
  )
}

export default Card
