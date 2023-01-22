import { getSession, signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react'
import spotifyApi from '../lib/spotify';

function useSpotify() {



    // @ts-ignore
        const {data:session} = useSession();

        useEffect(()=>{
            if(session){
                // if refresh access token fails , redirect user to login page
                // @ts-ignore
                if(session.error === "RefreshAccessTokenError"){
                    signIn();
                }
                // @ts-ignore
                spotifyApi.setAccessToken(session.accessToken);
                // @ts-ignore
                spotifyApi.getUserPlaylists(session?.user?.username).then(data => {

                })




            }
        }, [session]); 

  return spotifyApi;     
}

export default useSpotify
