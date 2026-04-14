import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
/**  User dropdown icon. */
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";

import adminLogo from '@/public/assets/images/admin.avif'
import { User, Settings, LogOut, CreditCard, HelpCircle, Shield } from "lucide-react"
import { useSelector } from 'react-redux'
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const UserDropDown = () => {
    const { auth } = useSelector((state) => state.auth)

    const user = {
        name: auth?.user?.name || "Avesh Katiyar",
        email: auth?.user?.email || "katiyaravesh333@gmail.com",
        avatar: adminLogo.src
    }

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()

            if (response.ok) {
                // Clear any client-side state if using Redux/Zustand
                // dispatch(logout()) or similar

                // Redirect to login page
                window.location.href = '/auth/login'
            } else {
                console.error('Logout failed:', data.message)
                // You might want to show a toast notification here
            }
        } catch (error) {
            console.error('Logout error:', error)
            // Show error toast notification
        }
    }

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href="/admin/products/new" className='cursor-pointer flex items-center gap-2'>
                        <IoShirtOutline />
                        <span>New Product</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href="/admin/orders" className='cursor-pointer flex items-center gap-2'>
                        <MdOutlineShoppingBag className="mr-2 h-4 w-4" />
                        <span>Order</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropDown