import React, { Fragment } from 'react'
import MainNavigation from './MainNavigation'

import classes from './Layout.module.css';
import StatusMessTimer from '../status/StatusMessTimer';



function Layout(props) {
  return (
    <Fragment>
      <MainNavigation />
      <StatusMessTimer />
      <main>{props.children}</main>
    </Fragment>
  )
}

export default Layout