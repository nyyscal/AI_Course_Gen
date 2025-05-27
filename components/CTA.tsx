import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CTA = () => {
  return (
    <section className='cta-section'>
      <div className='cta-badge'>Start learning your way.</div>
      <h2 className='text-3xl font-bold'>Build & Personalize Learning Companion</h2>
      <p>Pick a name, subject, voice & personality - and start learing thorugh voice conversations taht feels natural and fun.</p>
      <Image src="images/cta.svg" alt='cta' width={362} height={232}/>
      <button className='bg-black/50 text-white rounded-xl cursor-pointer px-4 py-2 flex items-center gap-2 hover:scale-105 transition-all'>
        <Image src="/icons/plus.svg" width={12} height={12} alt='icons'/>
        <Link href="/companions/new"> <p>Build a New Companion</p></Link>
      </button>
    </section>
  )
}

export default CTA