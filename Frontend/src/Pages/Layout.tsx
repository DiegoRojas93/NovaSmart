import { Outlet } from "react-router"

const Layout = () => {
  return (
    <div className="bg-brand-primary-6 min-h-screen">
      <Outlet/>
    </div>
  )
}

export default Layout
