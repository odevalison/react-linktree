import { createBrowserRouter } from "react-router";

import { Home } from "./pages/home";
import { Admin } from "./pages/admin";
import { Login } from "./pages/login";
import { Networks } from "./pages/networks";

import { Layout } from "./components/layout";
import { Private } from "./routes/Private";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/admin",
        element: (
          <Private>
            <Admin />
          </Private>
        ),
      },
      {
        path: "/admin/social",
        element: (
          <Private>
            <Networks />
          </Private>
        ),
      },
    ],
  },
]);

export { router };
