import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetter from '../components/NewsLetter'

export const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse velit aliquid alias sapiente suscipit dolorem repellat ex illo consectetur nisi aut omnis, in nam deleniti, enim similique rem recusandae eos. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam laudantium nemo magni alias, tempora numquam corporis fuga earum culpa excepturi similique obcaecati a repellendus odio voluptatum vitae consequuntur quae. Ut?</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla doloribus quo asperiores saepe voluptatum! Deserunt vel id a illum, dolorem ipsum? In illum harum dolor quam hic totam sed labore.</p>

        <b className='text-gray-800'>Our Mission</b>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, repudiandae esse! Sunt architecto in iusto iste mollitia ipsam ex suscipit, deserunt hic et omnis maxime? Saepe sit soluta tenetur repellat?</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assesment</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. .</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convinience</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
        </div>
    </div>

    <NewsLetter/>
    </div>
  )
}

export default About