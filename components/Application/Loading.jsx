import React from 'react'
import loading from '@/public/assets/images/loading.svg'
import Image from 'next/image'

const Loading = () => {
    return (
        <div className='h-screen w-screen flex justify-center item-start mt-12'>
            <Image src={loading} alt="loading" width={80} height={80} />
        </div>
    )
}

export default Loading