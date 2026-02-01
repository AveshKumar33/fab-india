import React from 'react'

const layout = ({ children }) => {
    return (
        <div className='h-screen w-screen flex justify-center item-center'>{children}</div>
    )
}

export default layout