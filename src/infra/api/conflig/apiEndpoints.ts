/**
 * API Endpoints Configuration
 * Centralized API endpoint definitions
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/public/auth/login",
    LOGOUT: "/public/auth/logout",
    REFRESH: "/public/auth/refresh",
  },

  // Classes
  CLASSES: {
    GETCLASSBYTEACCHER: (teacherId: string) => `/private/classes/teacher/${teacherId}`,
    GET_ALL: "/classes",
  },

  // Teacher
  TEACHER:{
    GETPROFILE: "/private/teachers/profile",
  },

  // Student
  STUDENT: {
    GETPROFILE: "/private/students/profile",
  },

  // Enrollments
  ENROLLMENTS: {
    GETBYCLASS: (classId: string) => `/private/enrollments/class/${classId}`,
    GETBYSTUDENT: (studentId: string) => `/private/enrollments/student/${studentId}`,
  },

  // notification
   NOTIFICATIONS: {
    CREATE: '/private/notifications',
    GET_ALL: '/private/notifications',
    MARK_READ: (id: string) => `/private/notifications/${id}/read`,
    MARK_ALL_READ: '/private/notifications/mark-all-read',
    DELETE: (id: string) => `/private/notifications/${id}`,
    DELETE_ALL_READ: '/private/notifications/delete-all-read',
  },

  // Assignments
  ASSIGNMENTS: {
    CREATE: '/private/assignments',
    GET_ALL: '/private/assignments',
    GET_BY_ID: (assignmentId: string) => `/private/assignments/${assignmentId}`,
    GET_BY_CLASS: '/private/assignments/class',
    GET_BY_SUBJECT: '/private/assignments/subject',
    GET_UPCOMING: '/private/assignments/upcoming',
    GET_PAST_DUE: '/private/assignments/past-due',
    GET_STATISTICS: (assignmentId: string) => `/private/assignments/${assignmentId}/statistics`,
    UPDATE: (assignmentId: string) => `/private/assignments/${assignmentId}`,
    DELETE: (assignmentId: string) => `/private/assignments/${assignmentId}`,
  },

  // Student Assignments
  STUDENT_ASSIGNMENTS: {
    CREATE: '/private/student-assignments',
    GET_ALL: '/private/student-assignments',
    GET_BY_ID: (studentAssignmentId: string) => `/private/student-assignments/${studentAssignmentId}`,
    GET_MY_ASSIGNMENTS: '/private/student-assignments/my-assignments',
    GET_MY_UNSUBMITTED: '/private/student-assignments/my-unsubmitted',
    GET_GRADED_BY_ME: '/private/student-assignments/graded-by-me',
    GET_SUBMISSIONS: '/private/student-assignments/submissions',
    GET_BY_STUDENT: (studentId: string) => `/private/student-assignments/student/${studentId}`,
    GET_UNSUBMITTED_BY_STUDENT: (studentId: string) => `/private/student-assignments/student/${studentId}/unsubmitted`,
    SUBMIT: (studentAssignmentId: string) => `/private/student-assignments/${studentAssignmentId}/submit`,
    GRADE: (studentAssignmentId: string) => `/private/student-assignments/${studentAssignmentId}/grade`,
    UPDATE: (studentAssignmentId: string) => `/private/student-assignments/${studentAssignmentId}`,
    DELETE: (studentAssignmentId: string) => `/private/student-assignments/${studentAssignmentId}`,
  },

} as const;
