'use client'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import UserDropDown from './UserDropDown'
import { Button } from '@/components/ui/button'
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from '@/components/ui/sidebar';
const Topbar = () => {
    const {toggleSidebar} = useSidebar()
    return (
        <div className='fixed border h-14 w-full top-0 left-0 right-0 z-30 md:ps-72 flex items-center 
        justify-between px-4 justify-between items-center bg-white dark:bg-gray-900'>

            <div>
                Search component
            </div>
            <div className='flex items-center gap-2'>
                <ThemeSwitch />
                <UserDropDown />
                <Button onClick={toggleSidebar} type="button" size="icon" className="ms-2 md:hidden"><RiMenu4Fill /></Button>
            </div>

        </div>
    )
}

export default Topbar