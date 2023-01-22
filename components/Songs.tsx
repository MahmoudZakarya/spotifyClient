import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song';

function Songs() {
    const playlist = useRecoilValue(playlistState);
    useEffect(()=>{},[playlist]);
  return (
    <div
    className='flex flex-col pb-28 w-full text-gray-400'>
        <div className='flex w-full mb-3 mt-3 pl-2'>
            <h6 className='mr-4'>#</h6>
            <div className='w-10 mr-4'></div>
            <h6 className='flex flex-col items-start w-1/3'>TITLE</h6>
            <h6 className='hidden md:inline ml-auto w-1/6'>ALBUM</h6>
            <h6 className='ml-auto w-1/6'>DURATION</h6>
        </div>
         <div className='mb-4 border-t-[0.1px] w-full  mt-2 border-gray-400 ' ></div>

        {/* @ts-ignore */}
        {playlist?.tracks.items.map((data, i)=>(
            <Song track={data} order={i}  />
            
        ))}
        </div>
  )
}

export default Songs