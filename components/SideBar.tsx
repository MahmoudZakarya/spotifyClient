import React, { useEffect, useState } from 'react';
import {HomeIcon, MagnifyingGlassIcon, BuildingLibraryIcon,
        RssIcon,PlusCircleIcon, 
        ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { HeartIcon} from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';
import { Avatar } from '@nextui-org/react';
import { useRecoilState } from 'recoil';
import {playlistIdState} from '../atoms/playlistAtom';
/// <reference types="spotify-api" />


 function SideBar() {
    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();
    const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
    // @ts-ignore
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);


useEffect(() => {
    // @ts-ignore
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }

    if(spotifyApi.getAccessToken()){
        // @ts-ignore
        spotifyApi.getUserPlaylists(session?.user?.username).then(function(data){
            setPlaylists(data.body.items);
            
        }, function(error){console.log("DID'T GET THE PLAYLISTS", error)})
    }
    
  }, [session, spotifyApi]);

  return (
    <div className=" flex-col text-gray-400 p-5 font-semibold text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll sm:w-[12rem] lg:w-[18rem]
    pb-36 scrollbar-hide h-screen hidden md:inline-flex">
        <div className=' flex flex-col space-y-5 '>
            <button className="flex items-center space-x-2 hover:text-white ease-in-out duration-700" 
            onClick={()=>{signOut()}}>
                <ArrowRightOnRectangleIcon className='h-5 w-5'/>
                <h6  className=''>Log Out</h6>
            </button>
            <button className="flex items-center space-x-2 hover:text-white ease-in-out duration-700">
                <HomeIcon className='h-5 w-5'/>
                <h6 className='font-semibold'>Home</h6>
            </button>

            <button className="flex items-center space-x-2 hover:text-white ease-in-out duration-700">
                <MagnifyingGlassIcon className='h-5 w-5'/>
                <h6 className='font-semibold'>Search</h6>
            </button>

            <button className="flex items-center space-x-2 hover:text-white ease-in-out duration-700">
                <BuildingLibraryIcon className='h-5 w-5'/>
                <h6 className='font-semibold'>Library</h6>
            </button>
            <div className=' flex self-center justify-self-center border-t-[0.1px] w-11/12  mt-2 border-gray-400 ' ></div>
            <button className="flex items-center space-x-2 hover:text-white ease-in-out duration-700">
                <HeartIcon className='h-5 w-5 text-red-500'/>
                <h6 className='font-semibold'>Liked Songs</h6>
            </button>

            <button className="flex items-center space-x-2 hover:text-white ease-in-out duration-700">
                <PlusCircleIcon className='h-5 w-5 text-blue-600'/>
                <h6 className='font-semibold'>Create Playlist</h6>
            </button>

            <button className="flex items-center space-x-2 hover:text-white ease-in-out duration-700">
                <RssIcon className='h-5 w-5 text-green-500'/>
                <h6 className='font-semibold'>Your Episodes</h6>
            </button>
            <div className='border-t-[0.1px] w-11/12  mt-2 border-gray-400' ></div>
            
                {playlists.map((playlist)=>{

                    return (
                        <div key={playlist.id} onClick={()=> setPlaylistId(playlist.id)} className='flex space-x-2 w-48 overflow-hidden '> 
                            <Avatar src={playlist.images[0].url} size="sm" squared />
                        <h6 className='truncate cursor-pointer font-bold hover:text-white overflow-hidden text-ellipsis text-xs lg:text-sm first-letter:hover:text-clip ease-in-out duration-700'>{playlist.name}</h6>
                        </div>
                    );
                })}
        </div>
    </div>
  )
}

export default SideBar 
