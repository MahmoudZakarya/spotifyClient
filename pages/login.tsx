import React from 'react'
import {getProviders, signIn} from 'next-auth/react'

function Login(providers:any) {
  return (
    <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center'>
      <img src="https://www.svgrepo.com/show/475684/spotify-color.svg" alt="" 
      className='w-52 mb-6' />

      {Object.values(providers).map((provider)=>(
// @ts-ignore
        <div key={provider.name}>
            
            <button className='bg-[#00DA5A] text-white p-5 rounded-full' 
            // @ts-ignore   
            onClick={()=>signIn(provider.id, {callbackUrl:'/'})}
            // @ts-ignore
            >Login With {provider?.name}</button>
        </div>

      ))}
    </div>
  )
}

export default Login ;

export async function getServerSideProps() {

    const providers = await getProviders(); 
    return {props : providers}
    }
    

