import React from 'react'
import useSpotify from '../hooks/useSpotify'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';

function Song({order, track}:{order:any, track:any}) {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);


     function playSong(){
      setCurrentTrackId(track?.track.id);
      setIsPlaying(true);
      spotifyApi.play({
        uris: [track?.track?.uri],
      }).catch((error)=>{
        if(error.statusCode == 403){
          alert("Premium required to play from external application")
        }else{
          alert(error.message);
        }
      })

    }
    // @ts-ignore
    const minutes:any | null =  Math.floor((track?.track?.duration_ms/1000) /60);
    // @ts-ignore
    const seconds:any | null = Math.floor( (track.track?.duration_ms/1000) - minutes*60);
      return (
    <div className='grid grid-cols-1  w-full rounded-md hover:bg-gray-800 cursor-pointer hover:text-white pl-2 pt-2 pb-2 text-gray-400 font-bold' onClick={playSong}>
        <div className='flex flex-row w-full '>
            <h6 className='mr-4 flex self-center justify-self-center'>{order+1}</h6>
             <img className='h-10 w-10 mr-4 self-center justify-self-center' src={track?.track?.album?.images[0]?.url} alt="" />
             <div className=' flex flex-col items-start w-1/3 overflow-clip self-center justify-self-center'>
                <h6 className='text-white'>{track.track?.name}</h6>
                <h6>{track.track?.artists[0]?.name}</h6>
             </div>
                <div className='hidden md:inline ml-auto w-1/6 self-center justify-self-center font-semibold'>
                <h6 >{track.track?.album?.name}</h6>
                </div>
                <div className='ml-auto w-1/6 self-center justify-self-center'>
              <h6 >{ seconds< 10 ? `${minutes}:0${seconds}`: `${minutes}:${seconds}`}</h6>
              </div>
        </div>
    </div>
  )
}

export default Song