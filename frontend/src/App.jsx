import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Home from './pages/Home.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import StudentRegister from './pages/StudentRegister.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import StudentResults from './pages/StudentResults.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CreateExam from './pages/CreateExam.jsx';
import ExamQuestions from './pages/ExamQuestions.jsx';
import TakeExam from './pages/TakeExam.jsx';
import ExamResult from './pages/ExamResult.jsx';
import AdminExamResults from './pages/AdminExamResults.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/register" element={<StudentRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/student"
            element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/results"
            element={
              <PrivateRoute role="student">
                <StudentResults />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/exam/:examId/take"
            element={
              <PrivateRoute role="student">
                <TakeExam />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/result/:attemptId"
            element={
              <PrivateRoute role="student">
                <ExamResult />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/exams/new"
            element={
              <PrivateRoute role="admin">
                <CreateExam />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/exams/:id/edit"
            element={
              <PrivateRoute role="admin">
                <CreateExam />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/exams/:examId/questions"
            element={
              <PrivateRoute role="admin">
                <ExamQuestions />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/exams/:examId/results"
            element={
              <PrivateRoute role="admin">
                <AdminExamResults />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
