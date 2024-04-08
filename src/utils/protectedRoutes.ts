import { Roles } from "@prisma/client";

export interface ProtectedRoutes {
  title: string;
  path: string;
  regex: RegExp;
  roles: (Roles | "SubOrgan")[] | "All";
}

export const protectedRoutes: ProtectedRoutes[] = [
  {
    title: "Post",
    path: "/admin/posts",
    regex: /\/admin\/posts(\/|)[A-Za-z]?/i,
    roles: "All",
  },
  {
    title: "Link Shortener",
    path: "/admin/link",
    regex: /\/admin\/link(\/|)/i,
    roles: "All",
  },
  {
    title: "Formulir",
    path: "/admin/form",
    regex: /\/admin\/forms(\/|)[A-Za-z]?/i,
    roles: "All",
  },
  {
    title: "Sub-Organ Setup",
    path: "/admin/sub-organ",
    regex: /\/admin\/sub-organ(\/|)[A-Za-z]?/i,
    roles: "All",
  },
  {
    title: "Aspirasi",
    path: "/admin/aspirasi",
    regex: /\/admin\/aspiration(\/|)[A-Za-z]?/i,
    roles: ["SuperAdmin", "Admin", "MPK"],
  },
  {
    title: "Users",
    path: "/admin/users",
    regex: /\/admin\/users(\/|)[A-Za-z]?/i,
    roles: ["SuperAdmin"],
  },
];
