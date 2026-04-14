
import React from 'react'
// Admin Sidebar icons.
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '../routes/AdminPanelRoute';

const AdminAppSidebarMenu = [
    {
        title: "Dashboard",
        icon: <AiOutlineDashboard />,
        href: ADMIN_DASHBOARD
    },
    {
        title: "Categories",
        icon: <BiCategory />,
        href: "#",
        subMenu: [
            {
                title: "All Categories",
                href: "#"
            },
            {
                title: "Add Category",
                href: "#"
            }
        ]
    },
    {
        title: "Products",
        icon: <IoShirtOutline />,
        href: "#",
        subMenu: [
            {
                title: "All Products",
                href: "#"
            },
            {
                title: "Add Product",
                href: "#"
            },
            {
                title: "Add Variant",
                href: "#"
            },
            {
                title: "Product Variants",
                href: "#"
            }
        ]
    },
    {
        title: "Coupons",
        icon: <RiCoupon2Line />,
        href: "#",
        subMenu: [
            {
                title: "All Coupons",
                href: "#"
            },
            {
                title: "Add Coupon",
                href: "#"
            }
        ]
    },
    {
        title: "Orders",
        icon: <MdOutlineShoppingBag />,
        href: "#",
    },
    {
        title: "Users",
        icon: <LuUserRound />,
        href: "#",
        subMenu: [
            {
                title: "All Users",
                href: "#"
            },
            {
                title: "Add User",
                href: "#"
            }
        ]
    },
    {
        title: "Customers",
        icon: <LuUserRound />,
        href: "/admin/customers"
    },
    {
        title: "Ratings & Reviews",
        icon: <IoMdStarOutline />,
        href: "/admin/reviews"
    },
    {
        title: "Media",
        icon: <MdOutlinePermMedia />,
        url: ADMIN_MEDIA_SHOW
    },

]

export default AdminAppSidebarMenu