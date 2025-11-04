import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import JournalListPage from "./pages/JournalListPage.jsx";
import EntryEditorPage from "./pages/EntryEditorPage.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import "./theme.css";

export default function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/" element={<AppLayout />}>
      <Route index element={<JournalListPage />} />
      <Route path="journals" element={<JournalListPage />} />
      <Route path="journals/new" element={<EntryEditorPage />} />
      <Route path="journals/:id/edit" element={<EntryEditorPage />} />
    </Route>
  </Routes>
</BrowserRouter>

  );
}
