import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Navbar from "../components/Nav";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import Test from "../Test/Test";


const AppRoute = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <div style={{ padding: "20px" }}>
                <Routes>
                    <Route path="/test" element={<Test/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/user" element={<Dashboard />} />
                    <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="*" element={<Login />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default AppRoute;
