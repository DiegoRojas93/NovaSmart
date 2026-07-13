import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { FormInstitutions } from './Pages/FormInstitutions';
import Home from "./Pages/Home";
import PageNotFound from "./Pages/PageNotFound";
// import Layout from "./Pages/Layout";
import { lazy, Suspense } from "react";
import User from "./Pages/User";

const Layout = lazy(() => import("./Pages/Layout"))

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={ <Home /> } />
          <Route path="/Home/Register" element={ <FormInstitutions /> } />

        </Route>

        <Route path="/instittution" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Layout />
          </Suspense>
        }>

          <Route path=":institutionId" element={ <User /> } />
        </Route>
        
        <Route path="/" element={ <Navigate to="/Home" />} />
        <Route path="*" element={ <PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}