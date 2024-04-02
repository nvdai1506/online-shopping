import React, { useContext, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Loading from "./components/ui/Loading";

import AuthContext from "./context/auth-context";
import ProtectedRoute from "./components/auth/ProtectedRoute";


import { CatalogContextLayout } from './context/catalog-context';
import { ProductContextLayout } from './context/product-context';
// import Test from "./pages/Test";

// import Login from './pages/Login';
// import Catalog from './pages/Catalog';
// import Product from './pages/Product';
// import Order from './pages/Order';
// import Dashboard from "./pages/Dashboard";

const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Catalog = React.lazy(() => import('./pages/Catalog'));
const Product = React.lazy(() => import('./pages/Product'));
const Order = React.lazy(() => import('./pages/Order'));
// const Voucher = React.lazy(() => import('./components/voucher/Voucher'));


function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  return (
    <Layout>
      <Suspense fallback={
        <div className='centered'>
          <Loading />
        </div>
      }>
        <Routes>
          <Route path='/login' element={<Login />} />
          {/* <Route path='/voucher' element={<Voucher />} /> */}
          <Route element={<ProtectedRoute isAuthentication={isLoggedIn} redirect='/login' />}>
            <Route path="/">
              <Route index element={<Dashboard />}></Route>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="account" element={<Dashboard />} />
              <Route path="details" element={<Dashboard />} />
              <Route path="history" element={<Dashboard />} />
            </Route>
            <Route element={<CatalogContextLayout />}>
              <Route path='/catalog' element={<Catalog />} />
            </Route>
            <Route element={<ProductContextLayout />}>
              <Route path='/product' element={<Product />} />
            </Route>
            <Route path='/order'>
              <Route index element={<Order />} />
            </Route>
            {/* <Route path="/voucher" element={<Voucher />} /> */}

          </Route>
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
