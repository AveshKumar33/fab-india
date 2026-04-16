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
        <Breadcrumb className="mb-4">
            <BreadcrumbList>
                {
                    breadcrumbData?.length > 0 && breadcrumbData.map((item, index) => {
                        return (
                            index !== breadcrumbData.length - 1 ? (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                </React.Fragment>
                            ) : (
                                <BreadcrumbItem key={index}>
                                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                </BreadcrumbItem>
                            )
                        )
                    })
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default AdminBreadcrumb