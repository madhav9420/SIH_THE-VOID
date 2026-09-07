import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import InspectionDetails from "./pages/InspectionDetails";
import InspectionHistory from "./pages/InspectionHistory";
import Login from "./pages/Login";
import ProductUpload from "./pages/ProductUpload";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/product/upload"
                    element={
                        <ProtectedRoute>
                            <ProductUpload />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <InspectionHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/inspection/:id"
                    element={
                        <ProtectedRoute>
                            <InspectionDetails />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;