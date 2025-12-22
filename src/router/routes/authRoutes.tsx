import { lazy } from "react";
import { RouteObject} from "react-router";
import { PublicRoute } from "../components";
import SessionExpired from "@/@core/components/ui/session-expired";
import { Register } from "@/views/pages/authentication";

// Lazy load layout
const BlankLayout = lazy(() => import("@core/layouts/BlankLayout"));

// Lazy load pages
const Login = lazy(() => import("@views/pages/authentication/Login"));

// Lazy load misc pages
const ComingSoon = lazy(() => import("@views/pages/misc/ComingSoon"));
const ErrorPage = lazy(() => import("@views/pages/misc/Error"));
const NotAuthorized = lazy(() => import("@views/pages/misc/NotAuthorized"));
const Maintenance = lazy(() => import("@views/pages/misc/Maintenance"));

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <PublicRoute redirectIfAuthenticated>
        <BlankLayout>
          <Login />
        </BlankLayout>
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute redirectIfAuthenticated>
        <BlankLayout>
          <Register />
        </BlankLayout>
      </PublicRoute>
    ),  
  },
  {
    path: "/coming-soon",
    element: (
      <BlankLayout>
        <ComingSoon />
      </BlankLayout>
    ),
  },
  {
    path: "/not-authorized",
    element: (
      <BlankLayout>
        <NotAuthorized />
      </BlankLayout>
    ),
  },
  {
    path: "/maintenance",
    element: (
      <BlankLayout>
        <Maintenance />
      </BlankLayout>
    ),
  },
  {
    path: "/error",
    element: (
      <BlankLayout>
        <ErrorPage
          errorCode="500"
          title="Server Error"
          message="Something went wrong."
        />
      </BlankLayout>
    ),
  },
  {
    path: "/session-expired",
    element: (
      <BlankLayout>
        <SessionExpired />
      </BlankLayout>
    ),
  },
];