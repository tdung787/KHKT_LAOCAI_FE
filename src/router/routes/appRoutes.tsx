import { lazy } from "react";
import {  RouteObject } from "react-router";
import { ProtectedRoute } from "../components";
import { TeacherEval } from "@/views/dashboard/teacher/TeacherEval";
import StudentProfile from "@/views/dashboard/student/StudentProfile";
import TeacherProfile from "@/views/dashboard/teacher/TeacherProfile";
import { RootRedirect } from "../components/RedirectsAuth";
import AdminAccets from "@/views/dashboard/admin/AdminAccounts";
// import { ProtectedRoute } from "../components";

const NotificationPage = lazy(
  () => import("@views/common/NotificationPage")
);

// Lazy load layouts
const VerticalLayout = lazy(() => import("@layouts/VerticalLayout"));
const BlankLayout = lazy(() => import("@core/layouts/BlankLayout"));

// Lazy load pages - Public
// Lazy load misc pages
// const ComingSoon = lazy(() => import("@views/pages/misc/ComingSoon"));
const ErrorPage = lazy(() => import("@views/pages/misc/Error"));
// const NotAuthorized = lazy(() => import("@views/pages/misc/NotAuthorized"));
// const Maintenance = lazy(() => import("@views/pages/misc/Maintenance"));

// Lazy load pages - Admin
const AdminDashboard = lazy(
  () => import("@views/dashboard/admin/AdminDashboard")
);
const AdminUsers = lazy(() => import("@views/dashboard/admin/AdminUsers"));
const AdminClasses = lazy(() => import("@views/dashboard/admin/AdminClasses"));
const AdminSubjects = lazy(
  () => import("@views/dashboard/admin/AdminSubjects")
);
const AdminReports = lazy(() => import("@views/dashboard/admin/AdminReports"));
const AdminNotifications = lazy(
  () => import("@views/dashboard/admin/AdminNotifications")
);
const AdminDatasetsModels = lazy(
  () => import("@views/dashboard/admin/AdminDatasetsModels")
);

// Lazy load pages - Teacher
const TeacherDashboard = lazy(
  () => import("@views/dashboard/teacher/TeacherDashboard")
);
const TeacherClasses = lazy(
  () => import("@views/dashboard/teacher/TeacherClasses")
);
const TeacherClassDetail = lazy(
  () => import("@views/dashboard/teacher/TeacherClassDetail")
);
const TeacherFeedbacks = lazy(
  () => import("@views/dashboard/teacher/TeacherFeedbacks")
);
const TeacherDatasetsModels = lazy(
  () => import("@views/dashboard/teacher/TeacherDatasetsModels")
);
const TeacherDatasets = lazy(
  () => import("@views/dashboard/teacher/TeacherDatasets")
);

// Lazy load pages - Student
const StudentDashboard = lazy(
  () => import("@views/dashboard/student/StudentDashboard")
);
const StudentClasses = lazy(
  () => import("@views/dashboard/student/StudentClasses")
);
const StudentClassDetail = lazy(
  () => import("@views/dashboard/student/StudentClassDetail")
);
const StudentScores = lazy(
  () => import("@views/dashboard/student/StudentScores")
);
const StudentAssignments = lazy(
  () => import("@views/dashboard/student/StudentAssignments")
);
const StudentAssignmentDetail = lazy(
  () => import("@views/dashboard/student/StudentAssignmentDetail")
);
const StudentLearningProgress = lazy(
  () => import("@views/dashboard/student/StudentLearningProgress")
);
const StudentAITutors = lazy(
  () => import("@views/dashboard/student/StudentAITutors")
);


// ✅ Root redirect component


export const appRoutes: RouteObject[] = [
  // Home Route
   {
    path: "/",
    element: <RootRedirect />,
  },



  // Admin Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <VerticalLayout userRole="admin" />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
            {
            path: "usersapprove",
            element: <AdminAccets />,
          },
          {
            path: "users",
            element: <AdminUsers />,
          },
          {
            path: "classes",
            element: <AdminClasses />,
          },
          {
            path: "subjects",
            element: <AdminSubjects />,
          },
          {
            path: "reports",
            element: <AdminReports />,
          },
          {
            path: "notifications",
            element: <AdminNotifications />,
          },
          {
            path: "datasets-models",
            element: <AdminDatasetsModels />,
          },
        ],
      },
    ],
  },

  // Teacher Routes
  {
    path: "/teacher",
    element: (
      <ProtectedRoute allowedRoles={['teacher']}>
        <VerticalLayout userRole="teacher" />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <TeacherDashboard />,
          },
          {
            path: "classes",
            children: [
              {
                index: true,
                element: <TeacherClasses />,
              },
              {
                path: ":classId",
                element: <TeacherClassDetail />,
              },
            ],
          },
          {
            path: "evaluates",
            element: <TeacherEval />,
          },
          {
            path: "feedbacks",
            element: <TeacherFeedbacks />,
          },
          {
            path: "datasets-models",
            element: <TeacherDatasetsModels />,
          },
          {
            path: "datasets",
            element: <TeacherDatasets />,
          },
           {
            path: "notifications",
            element: <NotificationPage />,
          },
           {
            path: "ai-tutors",
            element: <StudentAITutors />,
          }
        ],
      },
    ],
  },

  // Student Routes
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={['student']}>
        <VerticalLayout userRole="student" />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <StudentDashboard />,
          },
          {
            path: "classes",
            children: [
              {
                index: true,
                element: <StudentClasses />,
              },
              {
                path: ":classId",
                element: <StudentClassDetail />,
              },
            ],
          },
          {
            path: "scores",
            element: <StudentScores />,
          },
          {
            path: "assignments",
            children: [
              {
                index: true,
                element: <StudentAssignments />,
              },
              {
                path: ":assignmentId",
                element: <StudentAssignmentDetail />,
              },
            ],
          },
          {
            path: "learning-progress",
            element: <StudentLearningProgress />,
          },
          {
            path: "ai-tutors",
            element: <StudentAITutors />,
          },
          {
            path: "notifications",
            element: <NotificationPage />,
          }
        ],
      },
    ],
  },

  {
    path: "/student/profile",
    element: (
      <ProtectedRoute allowedRoles={['student']}>
        <StudentProfile />
      </ProtectedRoute>
    ),
  },

    {
    path: "/teacher/profile",
    element: (
      <ProtectedRoute allowedRoles={['teacher']}>
        <TeacherProfile />
      </ProtectedRoute>
    ),
  },

  // 404 - Not Found (Must be last)
  {
    path: "*",
    element: (
      <BlankLayout>
        <ErrorPage
          errorCode="404"
          title="Not Found"
          message="The page you are looking for does not exist."
        />
      </BlankLayout>
    ),
  },
];
