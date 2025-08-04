"use client"
import React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Card = ({name, url, preview, userId, businessId}: {name: string, url: string, preview: string, userId?: string, businessId?: string}) => {
  const router = useRouter()
  const isDeployed = !url.includes('untukmukaryamu')

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (userId && businessId) {
      router.push(`/${userId}/${businessId}`)
    }
  }
  return (
    <div className='group cursor-pointer w-[15rem] h-[16rem] bg-white/80 backdrop-blur-sm rounded-2xl relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50'>
      {/* Edit button */}
      <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
        <div 
          onClick={handleEditClick}
          className='bg-black/10 hover:bg-black/20 rounded-full p-2 backdrop-blur-sm transition-colors cursor-pointer'
        >
          <Image src='/edit.svg' alt='Edit' width={14} height={14} className='opacity-70' />
        </div>
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col h-full'>
        {/* Header */}
        <div className='mb-4 w-fit'>
          <h3 className='font-mont font-semibold text-xl text-gray-800 mb-1 leading-tight'>{name}</h3>
          <p className='text-[10px] text-gray-500 font-inter'>{isDeployed ? url : 'Website not deployed yet'}</p>
        </div>

        {/* Preview Image */}
        <div className='flex-1 flex items-center justify-center'>
          <div className='relative w-full h-32 rounded-lg overflow-hidden bg-gray-100/50'>
            {isDeployed ? (
              <iframe
                src={url}
                title="Embedded Website"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            ) : (
              <div className='flex items-center justify-center h-full w-full text-gray-400 font-inter text-sm'>
                Not deployed
              </div>
            )}
          </div>
        </div>

        {/* Status indicator */}
        <div className='mt-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className={`w-2 h-2 ${isDeployed ? 'bg-green-400' : 'bg-gray-400'} rounded-full`}></div>
            <span className='text-xs text-gray-500 font-inter'>{isDeployed ? 'Live' : 'Not deployed'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
