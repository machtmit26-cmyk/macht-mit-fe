import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem("adminToken") ? (
        <Component {...props} />
      ) : (
        <Redirect to="/admin" />
      )
    }
  />
);

export default ProtectedRoute;
