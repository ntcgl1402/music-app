import TopBar from '@/components/TopBar'
import { useMusicStore } from '@/stores/useMusicStore'
import React, { useEffect } from 'react'
import FeaturedSection from './components/FeaturedSection';
import { ScrollArea } from '@radix-ui/react-scroll-area';

const HomePage = () => {

  const { fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, isLoading, madeForYouSongs, featuredSongs, trendingSongs} = useMusicStore();

  useEffect(()=> {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs,fetchMadeForYouSongs,fetchTrendingSongs])
  console.log({isLoading, madeForYouSongs, featuredSongs,trendingSongs})
  return (
    <div className='rounded-md overflow-hidden'>
      <TopBar/>
      <ScrollArea className='h-[calc(100vh - 180px)]'>
        <div className='p-4 sm:p-6'>
          <h1 className='text-xl sm:text-3xl font-bold mb-6'>Good Afternoon</h1>
          <FeaturedSection />
        </div>

        <div className='space-y-8'>
          <p>Mode for you</p>
          <p>Trending</p>
        </div>
      </ScrollArea>
    </div>
  )
}

export default HomePage
