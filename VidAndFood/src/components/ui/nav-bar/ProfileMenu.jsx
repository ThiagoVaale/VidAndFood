import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import "./ProfileMenu.css";
import ProfileMenuToggle from "./ProfileMenuToggle ";
import AuthContext from "../../../services/context/authContext/AuthContext";

const ProfileMenu = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    openAuthModal,
    onLogout: ctxLogout,
  } = useContext(AuthContext);

  const isUser = user?.role === "User";
  const isUserSommelier = user?.role === "Sommelier";
  const isUserAdmin = user?.role === "Admin";

  const handleClickProfile = () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    setOpen(true);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    setOpen(false);
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await ctxLogout();
      }
    } finally {
      navigate("/home", { replace: true });
    }
  };

  return (
    <Dropdown align="end" show={open} onToggle={(next) => setOpen(next)}>
      <Dropdown.Toggle
        onClick={handleClickProfile}
        as={ProfileMenuToggle}
        open={open}
      />

      <Dropdown.Menu className="profile-dropdown">
        {isUserAdmin && (
          <>
            <Dropdown.Item
              as={Link}
              to="/sys-admin"
              onClick={() => setOpen(false)}
            >
              Sys Admin Panel
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item
              as="button"
              className="text-danger"
              onClick={handleLogout}
              style={{ fontWeight: "lighter" }}
            >
              Log out
            </Dropdown.Item>
          </>
        )}

        {isUserSommelier && !isUserAdmin && (
          <>
            <div className="premium-header px-3 py-2">
              <span className="premium-question">Welcome Sommelier!</span>
            </div>
            
            <Dropdown.Divider />

            <Dropdown.Item
              as={Link}
              to="/my-wines"
              onClick={() => setOpen(false)}
            >
              My Wines
            </Dropdown.Item>

            <Dropdown.Item onClick={() => navigate("/history")}>
              History
            </Dropdown.Item>

            <Dropdown.Item
              as={Link}
              to="/setting"
              onClick={() => setOpen(false)}
            >
              Settings
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item
              as="button"
              className="text-danger"
              onClick={handleLogout}
              style={{ fontWeight: "lighter" }}
            >
              Log out
            </Dropdown.Item>
          </>
        )}

        {isUser && !isUserSommelier && !isUserAdmin && (
          <>
            <div className="premium-header px-6 py-3 mx-7">
              <span className="premium-question">¿Do you want to be a Sommelier?</span>

              <Button
                variant="outline-dark"
                size="sm"
                className="premium-btn"
                onClick={() => {
                  setOpen(false);
                  navigate("/setting");
                }}
              >
                Sommelier
              </Button>
            </div>

            <Dropdown.Divider />

            <Dropdown.Item onClick={() => navigate("/history")}>
              History
            </Dropdown.Item>

            <Dropdown.Item
              as={Link}
              to="/setting"
              onClick={() => setOpen(false)}
            >
              Settings
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item
              as="button"
              className="text-danger"
              onClick={handleLogout}
              style={{ fontWeight: "lighter" }}
            >
              Log out
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileMenu;
