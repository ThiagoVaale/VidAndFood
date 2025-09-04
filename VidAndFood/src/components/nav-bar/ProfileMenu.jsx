import { useState } from "react";
import { Link} from "react-router-dom"; // <- usar react-router-dom
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import "./ProfileMenu.css";
import ProfileMenuToggle from "./ProfileMenuToggle ";

const ProfileMenu = ({ onLogout }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    setOpen(false);
    try {
      if (onLogout) await onLogout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <Dropdown align="end" show={open} onToggle={(next) => setOpen(next)}>
      <Dropdown.Toggle as={ProfileMenuToggle} open={open} />

      <Dropdown.Menu className="profile-dropdown">
        {/* Parte superior: Cellar + Premium */}
        <div className="d-flex justify-content-between align-items-center px-3 py-2">
          <Link to="/cellar" className="menu-link" onClick={() => setOpen(false)}>
            Cellar
          </Link>
          <Button
            variant="outline-dark"
            size="sm"
            className="premium-btn"
            onClick={() => {
              setOpen(false);
              navigate("/premium");
            }}
          >
            Premium
          </Button>
        </div>

        <Dropdown.Divider />

        {/* Opciones */}
        <Dropdown.Item as={Link} to="/wines" onClick={() => setOpen(false)}>
          My Wines
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/profile" onClick={() => setOpen(false)}>
          Profile
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/settings" onClick={() => setOpen(false)}>
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
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileMenu;
