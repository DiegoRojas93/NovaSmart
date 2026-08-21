import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { FormInstitutions } from './Pages/FormInstitutions';
import Home from "./Pages/Home";
import PageNotFound from "./Pages/PageNotFound";
import { lazy, Suspense } from "react";
import User from "./Pages/User";
import { Login } from "./Pages/Login";
import { About } from "./Pages/About";
import { Contact } from "./Pages/Contact";
import { ForgotPassword } from "./Pages/ForgotPassword";
import { ResetPassword } from "./Pages/ResetPassword";


const Layout = lazy(() => import("./Pages/Layout"))

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={ <Home /> } />
          <Route path="/Register" element={ <FormInstitutions /> } />
          <Route path="/Login" element={ <Login /> } />
          <Route path="/ForgotPassword" element={ <ForgotPassword /> } />
          <Route path="/reset-password" element={ <ResetPassword /> } />
          <Route path="/About" element={ <About /> } />
          <Route path="/Contact" element={ <Contact /> } />
        </Route>

        <Route path="/users" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Layout />
          </Suspense>
        }>
          <Route path=":userId" element={ <User /> } />
        </Route>
        
        <Route path="/" element={ <Navigate to="/Home" />} />
        <Route path="*" element={ <PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}