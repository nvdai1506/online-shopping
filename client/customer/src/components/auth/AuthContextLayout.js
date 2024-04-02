import React from 'react'
import { Outlet } from 'react-router-dom';
import {AuthContextProvider} from '../../context/auth-context';

function AuthContextLayout() {
  return (
    <AuthContextProvider>
        <Outlet/>
    </AuthContextProvider>
  )
}

export default AuthContextLayout