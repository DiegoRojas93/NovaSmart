import { Outlet } from "react-router"

const Layout = () => {
  return (
    <div className="bg-emerald-950 min-h-screen w-screen">
      <Outlet/>
    </div>
  )
}

export default Layout
