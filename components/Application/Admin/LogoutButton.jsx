import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { AiOutlineLogout } from "react-icons/ai"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { logoutUser } from "@/redux/slices/authSlice"
import { WEBSITE_LOGIN } from "../../../routes/WebsitePanelRoute"

export default function LogoutButton() {
    const router = useRouter()
    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {
            // Dispatch the logoutUser async thunk
            const result = await dispatch(logoutUser())

            if (logoutUser.fulfilled.match(result)) {
                console.log('Logout successful')
                /** Clear any other Redux slices if needed */
                /**  dispatch(clearUserData()) */
                /** dispatch(clearCart()) */

                /** Redirect to login page */
                router.push(WEBSITE_LOGIN)
            } else {
                console.error('Logout failed:', result.payload)
                /** You might want to show a toast notification here */
            }
        } catch (error) {
            console.error('Logout error:', error)
            /** Show error toast notification */
        }
    }

    return (
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <AiOutlineLogout className="text-red-600" />
            Log out
        </DropdownMenuItem>
    )
}