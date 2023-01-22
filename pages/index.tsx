import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import SideBar from '../components/SideBar'
import Center from '../components/Center'
import { getSession } from 'next-auth/react'
import Player from '../components/Player'

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen w-screen overflow-hidden">
      <Head>
        <title>Spotify Client</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> 

      <main className='flex w-screen h-screen'>
          <SideBar />
          <Center/>

      </main>

      <div className='sticky bottom-0 w-full z-[100]'>
                <Player/>
      </div>

    </div>
  )
}

export default Home

export async function getServerSideProps(context:any){
  const session = await getSession(context);
  return {
    props: {
      session
    }
  }

}
