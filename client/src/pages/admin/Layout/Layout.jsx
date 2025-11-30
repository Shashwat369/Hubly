import React from 'react'
import Sidebar from '../../../components/admin/Sidebar/Sidebar'

import { Outlet } from 'react-router-dom'

import "./Layout.css"

const Layout = () => {
  return (
    <div className="app-container">
        <Sidebar/>
        <div className="main-content">

        <Outlet />
      </div>
    </div>
  )
}

export default Layout