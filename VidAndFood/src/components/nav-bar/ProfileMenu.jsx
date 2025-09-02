import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";
import COLORS from "../../utils/colors";
import "./ProfileMenu.css"; // estilos personalizados

const ProfileMenu = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    setOpen(false);
    onLogout?.();
    navigate("/");
  };

  // Toggle con icono de usuario
  const Toggle = ({ onClick }) => (
    <Button
      variant="link"
      className="p-0 border-0 shadow-none"
      aria-label="Open profile menu"
      aria-expanded={open ? "true" : "false"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="bi bi-person-circle"
        style={{ width: 32, height: 32, color: COLORS.red }}
      >
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </Button>
  );

  return (
    <Dropdown align="end" show={open} onToggle={(next) => setOpen(next)}>
      <Dropdown.Toggle as={Toggle} />

      <Dropdown.Menu className="profile-dropdown">
        {/* Parte superior: Cellar + Premium */}
        <div className="d-flex justify-content-between align-items-center px-3 py-2">
          <a href="/cellar" className="menu-link">Cellar</a>
          <Button variant="outline-dark" size="sm" className="premium-btn">
            Premium
          </Button>
        </div>
        <Dropdown.Divider />

        {/* Opciones */}
        <Dropdown.Item href="/wines">My Wines</Dropdown.Item>
        <Dropdown.Item href="/profile">Profile</Dropdown.Item>
        <Dropdown.Item href="/settings">Settings</Dropdown.Item>
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
