import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const navigate = useNavigate();
  const { access_token, user_role } = useSelector((state) => state.user);

  if (!access_token) {
    return navigate("/signin");
  }

  if (!allowedRoles.includes(user_role)) {
    return navigate("/unauthorized");
  }

  return <Outlet />;
};

export default RequireAuth;
