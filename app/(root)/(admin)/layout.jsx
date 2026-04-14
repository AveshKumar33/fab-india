import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '../../../components/Application/Admin/AppSidebar'
import Topbar from '../../../components/Application/Admin/Topbar'
import ThemeProvider from '../../../components/Application/Admin/ThemeProvider'

const AdminLayout = ({ children }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar />
                <main className="border border-red-500 md:w-[calc(100vw-16rem)]">
                    <div className="border border-blue-500 p-4 px-5 min-h-[calc(100vh-40px)]">
                        <Topbar />
                        {children}
                    </div>
                    <div className="border-t h-[40px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-sm">
                        @ 2026 E-Commerce Avesh Katiyar
                    </div>
                </main>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export default AdminLayout