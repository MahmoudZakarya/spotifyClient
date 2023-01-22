import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import {ArrowsRightLeftIcon, BackwardIcon, PlayCircleIcon, ForwardIcon, SpeakerWaveIcon, ArrowPathIcon, PauseCircleIcon} from '@heroicons/react/24/solid'
import {SpeakerWaveIcon as SpeakerWaveOutlineIcon, HeartIcon} from '@heroicons/react/24/outline'
import { debounce } from 'lodash';

function Player() {
  const {data:session , status} = useSession();
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState); 
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();
  const fetchCurrentSong = ()=>{
    if(!songInfo){
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        console.log('Now Playing:', data.body?.item)
        // @ts-ignore
        setCurrentTrackId(data.body?.item?.id);
        spotifyApi.getMyCurrentPlaybackState().then((data)=>{
          setIsPlaying(data.body?.is_playing);
        })
      
      });
    }
  }

  const handlePlayPause = ()=>{
    spotifyApi.getMyCurrentPlaybackState().then((data)=>{
      if(data.body?.is_playing){
        spotifyApi.pause().catch((error)=>{
          alert("Premium is Required")
        }); 
        setIsPlaying(false);
      }else{
        spotifyApi.play().catch((error)=>{
          alert("Premium is Required")
        });
        setIsPlaying(true);
      }
    })
  }

  const debouncedAdjustVolume = useCallback(
    debounce((volume:any)=>{

      spotifyApi.setVolume(volume).catch(err=>{})
    }, 300), []
  )

  useEffect(()=>{

    if(spotifyApi.getAccessToken() && !currentTrackId){
      fetchCurrentSong();
      setVolume(50);


    }
  }, [currentTrackId, spotifyApi, session]); 



  useEffect(()=>{
    if(volume > 0 && volume < 100){
      debouncedAdjustVolume(volume);
    }
  }, [volume])

    return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
        <div className='flex items-center space-x-4 '>
          {/* @ts-ignore */}
          {songInfo?.album?.images?.[0]?.url && (<img className='hidden md:inline h-16 w-16' src={songInfo?.album?.images?.[0]?.url} alt="" />)}
          <div>

            <h3 className='font-semibold text tracking-normal'>{songInfo?.name}</h3>
            <h6 className='text-sm text-gray-400 font-medium tracking-wide'>{songInfo?.artists?.[0]?.name}</h6>
          </div>
        </div>

        <div className='text-white flex items-center  justify-evenly'>
          <ArrowsRightLeftIcon className='button' />
          <BackwardIcon className='button' onClick={()=> spotifyApi.skipToPrevious()} />

          {isPlaying? (
            <PauseCircleIcon className='button w-10 h-10' onClick={handlePlayPause}/>
          ): (
            <PlayCircleIcon className='button w-10 h-10' onClick={handlePlayPause} />
          )}
          <ForwardIcon className='button' onClick={()=> spotifyApi.skipToNext()}  />
          <ArrowPathIcon className='button' onClick={()=>{}}  />


        </div>

        <div className='flex items-center justify-end space-x-2 md:space-x-4 pr-4'>
          <SpeakerWaveOutlineIcon className='button' onClick={()=>{
            volume > 0 && setVolume(volume - 10)  
          }}/>
          <input className='w-16 md:w-32' type="range" value={volume} onChange={(val)=>setVolume(Number(val.target.value))} min={0} max={100} />
          <SpeakerWaveIcon className='button' onClick={()=>{
            volume < 100 && setVolume(volume + 10)  
          }} />
        </div>
    </div>
  )
}

export default Player