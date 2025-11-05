import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EntryEditorPage from "./pages/EntryEditorPage";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JournalListPage from "./pages/JournalListPage";
import "./theme.css";
import ProtectedRoute from "./components/ProtectedRoute";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ✅ Protect everything inside AppLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<JournalListPage />} />
        <Route path="journals" element={<JournalListPage />} />
        <Route path="journals/new" element={<EntryEditorPage />} />
        <Route path="journals/:id/edit" element={<EntryEditorPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);