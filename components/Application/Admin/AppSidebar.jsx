'use client'
import React from 'react'
import Image from 'next/image'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import logoBlack from '@/public/assets/images/logo-black.png'
import logoWhite from '@/public/assets/images/logo-white.png'
/**  App sidebar close and arrow icon. */
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import AdminAppSidebarMenu from '../../../lib/AdminAppSidebarMenu';
import { useSidebar } from '@/components/ui/sidebar';

const AppSidebar = () => {
    const {toggleSidebar} = useSidebar()
    return (
        <Sidebar className='z-40 ps-5'>
            <SidebarHeader className='border-b h-14 p-0' />
            <div className='flex items-center justify-between p-4'>
                <Image src={logoBlack} className="black-mode dark:hidden h-[50px] w-auto" alt="Logo" />
                <Image src={logoWhite} className="white-mode hidden dark:block h-[50px] w-auto" alt="Logo" />
                <Button onClick={toggleSidebar} type="button" size="icon" className="md:hidden"><IoMdClose /></Button>
            </div>
            <SidebarContent className='p-4'>
                {AdminAppSidebarMenu?.map((item) => (
                    <SidebarMenu key={item.id}>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                {item.icon}
                                <span>{item.title}</span>
                                <LuChevronRight />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                ))}
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

export default AppSidebar