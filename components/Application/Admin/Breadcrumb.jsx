import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const AdminBreadcrumb = ({ breadcrumbData }) => {
    return (
        <Breadcrumb className="mb-5">
            <BreadcrumbList>
                {
                    breadcrumbData?.length > 0 && breadcrumbData.map((item, index) => {
                        return (
                            index !== breadcrumbData.length - 1 ? <div key={index} className='flex items-center'>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </div> : <div key={index} className='flex items-center'>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </div>
                        )
                    })
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default AdminBreadcrumb