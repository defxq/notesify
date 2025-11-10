import { Outlet } from "react-router";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";


const DashLayout = () => {
  return (
    <>
        <DashHeader />
          <Outlet />
        <DashFooter />
    </>
  )
}
export default DashLayout