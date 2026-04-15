import React from 'react'
import AdminBreadcrumb from '@/components/Application/Admin/Breadcrumb'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute'
import { ADMIN_DASHBOARD } from '../../../../../routes/AdminPanelRoute'

const MediaPage = () => {
    const breadcrumbData = [
        { label: 'Home', href: ADMIN_DASHBOARD },
        { label: 'Media', href: ADMIN_MEDIA_SHOW }
    ]

    return (
        <div className="p-6">
            <AdminBreadcrumb breadcrumbData={breadcrumbData} />

            <div className="mt-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Upload and manage your media files</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload New Media</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Supported formats: JPG, PNG, GIF, WebP, MP4, PDF
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <UploadMedia isMultiple={true} />
                        <UploadMedia isMultiple={false} />
                    </div>
                </div>

                <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Media Library</h2>
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>No media files uploaded yet.</p>
                        <p className="text-sm mt-2">Upload your first media file to get started.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MediaPage