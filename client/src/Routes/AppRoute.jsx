import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../pages/DashboardLayout";
import Folders from "../pages/Folders";
import Notes from "../pages/Notes";
import RevisionSchedule from "../pages/RevisionSchedule";
import Revision from "../pages/Revision";
import MockTests from "../pages/MockTests";
import Settings from "../pages/Settings";
import Payment from "../pages/Payment";
import Upgrade from "../pages/Upgrade";
import { AppProvider } from "../context/AppContext";




const AppRoute = () => {
    return (
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="folders" element={<Folders />} />
                        <Route path="notes" element={<Notes />} />
                        <Route path="schedule" element={<RevisionSchedule />} />
                        <Route path="revision" element={<Revision />} />
                        <Route path="tests" element={<MockTests />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="payment" element={<Payment />} />
                        <Route path="upgrade" element={<Upgrade />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AppProvider>
    )
};


export default AppRoute;