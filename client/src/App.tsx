import { Navigate, useRoutes } from "react-router-dom";
import NotFound from "./components/404!/Notfound";
import DynamicInputForm from "./components/Test/Test";
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import Addcate from "./pages/admin/category/Addcate";
import Listcate from "./pages/admin/category/Listcate";
import Updatecate from "./pages/admin/category/Updatecate";
import AdminProductAdd from "./pages/admin/product/Add";
import AdminProductUpdate from "./pages/admin/product/Edit";
import AdminProductList from "./pages/admin/product/List";
import Cart from "./pages/client/Cart";
import Detail from "./pages/client/Detail";
import Homepage from "./pages/client/Homepage";
import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import Checkout from "./pages/client/Checkout";
import OrdersList from "./pages/client/OrderList";
import ProductLiked from "./pages/client/ProductLiked";

const routeConfig = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "product/liked",
        element: <ProductLiked />,
      },
      {
        path: "product/:id",
        element: <Detail />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "carts",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "/orders/list",
        element: <OrdersList />,
      },
      
      {
        path: "test",
        element: <DynamicInputForm />,
      }
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="product/list" replace />,
      },
      {
        path: "product/list",
        element: <AdminProductList />,
      },
      {
        path: "product/add",
        element: <AdminProductAdd />,
      },
      {
        path: "product/edit/:id",
        element: <AdminProductUpdate />,
      },
      {
        path: "category/add",
        element: <Addcate />,
      },
      {
        path: "category/list",
        element: <Listcate />,
      },
      {
        path: "category/edit/:id",
        element: <Updatecate />,
      },
    ],
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

function App() {
  const routes = useRoutes(routeConfig);

  return (
    <main>{routes}</main>

  );
}

export default App;
