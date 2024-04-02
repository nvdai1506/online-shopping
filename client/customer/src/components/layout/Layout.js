import React, { Fragment } from 'react'
import MainNavigation from './MainNavigation'

import './Layout.module.css';
import StatusMessTimer from '../status/StatusMessTimer';
import Footer from './Footer';
import Top from './Top';


function Layout(props) {
  return (
    <Fragment>
      <MainNavigation />
      <StatusMessTimer />
      <main>{props.children}</main>
      <Top />
      <Footer />
    </Fragment>
  )
}

export default Layout