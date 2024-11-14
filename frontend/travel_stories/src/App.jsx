import React from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Home from './pages/Home/Home'
import SignUp from './pages/Auth/SignUp'
import Root from './components/Root'
import Navbar2 from './components/Navbar2'
import Feed from './components/Feed'
import ViewUser from './components/ViewUser'




const router = createBrowserRouter([
  {
    path:'/',
    element: <div>

         <Navbar2/>
         <Root/>
    </div>
  },
  
  {
    path:'/dashboard',
    element:<Home/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<SignUp/>
  },
  {
    path: '/feed',
    element: (
      <div>
        <Navbar2 />
        <Feed />
      </div>
    ),
  },
  {
    path: '/view',
    element: (
      <div>
        <Navbar2 />
        <ViewUser />
      </div>
    ),
  },
])

function App() {
  return (
    <RouterProvider router={router} />
    )
}



export default App