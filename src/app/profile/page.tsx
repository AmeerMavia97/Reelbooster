import React from 'react'
import ProfileOptions from './ProfileComponents/profileOptions'
import ProfileHeader from './ProfileComponents/profileHeader'
function page() {
  return (
    <>
    <div className='pt-[60px] sm:max-w-6xl sm:px-6 2xl:px-0 sm:mx-auto'>
      <ProfileHeader isMyProfile={true}/>
      <ProfileOptions />
    </div>
    </>
  )
}

export default page