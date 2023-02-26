import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

function Layout() {

  return (
    <div className="h-screen flex flex-col flex-grow bg-gray-200">
      <Header />

      {/* <main className="flex h-full m-auto"> */}
      <main className="flex h-full justify-center">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout;
