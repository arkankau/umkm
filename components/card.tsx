"use client"
import React from 'react'
import { useState } from 'react'
import Image from 'next/image'

const Card = ({name, url, preview}: {name: string, url: string, preview: string}) => {
  return (
    <div className='flex flex-col font-inter justify-center w-[15rem] h-[12rem] bg-[#E9E4DA] rounded-xl relative'>
      <Image src='/edit.svg' alt='Edit' width={16} height={16} className='absolute top-2 right-2' />
      <h3 className='font-bold mx-2 text-3xl'>{name}</h3>
      <h2 className='text-sm mx-2'>{url}</h2>
      <Image src={preview} alt={name} width={190} height={100} className='mt-3 mx-2 rounded-lg w-fit' />

    </div>
  )
}

export default Card
