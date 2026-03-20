import axisos from "axios";

const api = axisos.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

// This interceptor runs on every response.
// On 401, clear stale auth state but DO NOT force-redirect.
// UI/pages can decide what to do (stay on current page, show message, or navigate).
// Also unwraps the { success, message, data } envelope that sendSuccess() wraps every response in,
// so all services can just read response.data without going through .data.data.


api.interceptors.response.use(
    (response) => {
        // Unwrap backend envelope: { success: true, message: "...", data: { ... } }
        if (response.data && response.data.success === true && 'data' in response.data) {
            response.data = response.data.data;
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Keep control in the UI layer.
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
        }
        return Promise.reject(error);
    }
);

export default api;