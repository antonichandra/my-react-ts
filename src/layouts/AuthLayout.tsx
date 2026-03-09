import { Outlet } from "react-router-dom"
import { ModeToggle } from "../components/ModeToggle"

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500">
        <ModeToggle />
      </div>
      <Outlet />
    </div>
  )
}
