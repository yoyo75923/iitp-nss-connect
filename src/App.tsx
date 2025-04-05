
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FeaturePlaceholder from "./pages/FeaturePlaceholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Feature routes */}
            <Route path="/attendance/scan" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/attendance/history" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/attendance/manage" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/gallery" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/gallery/upload" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/donation" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/donation/manage" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/blood-donation" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/blood-donation/manage" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/fundraising" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/fundraising/manage" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/shop" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/shop/manage" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            <Route path="/volunteers" element={
              <ProtectedRoute>
                <FeaturePlaceholder />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
