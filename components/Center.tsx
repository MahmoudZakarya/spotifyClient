import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@nextui-org/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline'; 
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState} from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';
import Player from './Player';
import { Audio } from 'react-loader-spinner'



function Center() {

    const {data:session} = useSession();
    // @ts-ignore
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const spotifyApi = useSpotify();
    const [isLoading, setIsLoading] = useState(false) ;


    const colors:string[] = [ 
        "from-red-500", "from-yellow-500","from-yellow-700",  "from-blue-700", "from-blue-500",
        "from-slate-700", "from-indigo-500",  "from-indigo-600", "from-pink-500", "from-pink-600", "from-green-400",  "from-green-900", "from-purple-900", "from-purple-600", "from-orange-600",
         "from-rose-600","from-lime-700", "from-emerald-700", "from-teal-700", "from-sky-700", "from-sky-600", "from-violet-900", "from-violet-400", "from-fuchsia-900","from-rose-500",
];

var [color, setColor] = useState<string | undefined>('');
var [songsColor, setSongsColor] = useState<string | undefined>('');

console.log(songsColor) 

useEffect(()=>{
    var chosenColor = shuffle(colors).pop();
    setColor(chosenColor);
    setSongsColor(('bg'+chosenColor?.toString().slice(4).trim()));
},[playlistId] )

useEffect(()=>{
        setIsLoading(true)
        spotifyApi.getPlaylist(playlistId).then((data)=>{
            // @ts-ignore
            setPlaylist(data.body);
            setIsLoading(false)
        }).catch((error)=>{
            alert(error.message)
        }); 


    },[spotifyApi,playlistId,playlistState, playlistIdState] )

    
  return  isLoading ? (
    <div className='w-full h-full flex items-center justify-center'>
  <Audio height="80" width="80" color="green" ariaLabel="loading"/>
  </div> ) : (
  
  <div className='w-full text-white bg-black overflow-scroll scrollbar-hide'>

        <header className='absolute top-5 right-8 z-50'>
            <div className='flex items-center w-max p-0.5 rounded-full bg-black space-x-3 cursor-pointer hover:bg-slate-900  ease-in-out duration-500 
            pr-2
            '>
                {/* @ts-ignore */}
                <Avatar zoomed textColor="black" size="sm" src={session?.user?.image} text={session?.user?.name?.slice(0,1)} />
                <h2 className='font-semibold text-sm font-mono  '>{session?.user?.name}</h2>
                <ChevronDownIcon className='w-4 h-4'/>
            </div>
        </header>


        <section className={`flex flex-col bg-gradient-to-b to-black ${color} h-full text-white p-8 overflow-scroll scrollbar-hide bg-opacity-10`}>
            <div className='flex flex-col md:flex-row h-4/6 md:h-1/2 w-full md:space-x-6 items-center  justify-center lg:justify-start pt-12'>
                 {/* @ts-ignore */}
            <img className='h-52 w-52 md:h-60 md:w-60 lg:h-60 lg:w-60 mb-4 self-center ease-in-out duration-300 drop-shadow-[0_35px_35px_rgba(0,0,0,0.65)]' src={playlist?.images?.[0]?.url} alt="" />
            <div className='flex flex-col h-3/4  justify-start items-start md:justify-center lg:justify-end '>
                <p className='font-bold'>PLAYLIST</p>
                {/* @ts-ignore */}
                <h2 className='text-2xl md:text-3xl lg:text-6xl font-semibold'>{playlist?.name}</h2>
            </div>
            </div>


           



           
        </section>

         <div className={`w-full relative p-8  h-fit bg-gray-900 bg-opacity-25 top-[-35%]  sm:top-[-20%] md:top-[-35%] lg:top-[-40%]`}>
                <Songs />
            </div>
            

    </div>
    ) 
    
  
}

export default Center
