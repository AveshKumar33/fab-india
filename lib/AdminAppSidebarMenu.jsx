
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
        id: "dashboard",
        title: "Dashboard",
        icon: <AiOutlineDashboard />,
        href: ADMIN_DASHBOARD
    },
    {
        id: "categories",
        title: "Categories",
        icon: <BiCategory />,
        href: "#",
        subMenu: [
            {
                id: "all-categories",
                title: "All Categories",
                href: "#"
            },
            {
                id: "add-category",
                title: "Add Category",
                href: "#"
            }
        ]
    },
    {
        id: "products",
        title: "Products",
        icon: <IoShirtOutline />,
        href: "#",
        subMenu: [
            {
                id: "all-products",
                title: "All Products",
                href: "#"
            },
            {
                id: "add-product",
                title: "Add Product",
                href: "#"
            },
            {
                id: "add-variant",
                title: "Add Variant",
                href: "#"
            },
            {
                id: "product-variants",
                title: "Product Variants",
                href: "#"
            }
        ]
    },
    {
        id: "coupons",
        title: "Coupons",
        icon: <RiCoupon2Line />,
        href: "#",
        subMenu: [
            {
                id: "all-coupons",
                title: "All Coupons",
                href: "#"
            },
            {
                id: "add-coupon",
                title: "Add Coupon",
                href: "#"
            }
        ]
    },
    {
        id: "orders",
        title: "Orders",
        icon: <MdOutlineShoppingBag />,
        href: "#",
    },
    {
        id: "users",
        title: "Users",
        icon: <LuUserRound />,
        href: "#",
        subMenu: [
            {
                id: "all-users",
                title: "All Users",
                href: "#"
            },
            {
                id: "add-user",
                title: "Add User",
                href: "#"
            }
        ]
    },
    {
        id: "customers",
        title: "Customers",
        icon: <LuUserRound />,
        href: "/admin/customers"
    },
    {
        id: "reviews",
        title: "Ratings & Reviews",
        icon: <IoMdStarOutline />,
        href: "/admin/reviews"
    },
    {
        id: "media",
        title: "Media",
        icon: <MdOutlinePermMedia />,
        href: ADMIN_MEDIA_SHOW
    },

]

export default AdminAppSidebarMenu