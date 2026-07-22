import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import Notices from "./pages/Notices";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import CreateBatch from "./pages/CreateBatch";
import JoinBatch from "./pages/JoinBatch";
import BatchDetail from "./pages/BatchDetail";
import MemberProfile from "./pages/MemberProfile";
import Track from "./pages/Track";
import ProgressPage from "./pages/Progress";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";

const guard = (el, roles) => <ProtectedRoute roles={roles}>{el}</ProtectedRoute>;

export default function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/events" element={<Events />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={guard(<Dashboard />)} />
              <Route path="/batches" element={guard(<Batches />)} />
              <Route path="/track" element={guard(<Track />)} />
              <Route path="/progress" element={guard(<ProgressPage />)} />
              <Route path="/tools" element={guard(<Tools />)} />
              <Route path="/join-batch" element={guard(<JoinBatch />)} />
              <Route path="/create-batch" element={guard(<CreateBatch />, ["trainer", "admin"])} />
              <Route path="/batch/:id" element={guard(<BatchDetail />)} />
              <Route path="/batch/:id/member/:userId" element={guard(<MemberProfile />)} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}
