import React from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import NewsLetter from '../components/NewsLetter'

const Contact = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'> Our Store</p>
          <p className=' text-gray-500'>Sector 15, CBD Belapur <br/> Navi Mumbai, Maharashtra, India</p>
          <p className=' text-gray-500'>Tel: 1234567890 <br/> Email: abc@gmail.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at forever</p>
          <p className=' text-gray-500'>Learn More about job openings</p>
          <button className='border border-black px-8 py-4 text-sm hover: bg-black hover: text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>

      <NewsLetter />

      </div>
   
  )
}

export default Contact