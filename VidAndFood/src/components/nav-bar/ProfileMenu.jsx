import { useEffect, useRef, useState } from "react";
import { Button, DropdownMenu } from "react-bootstrap";
import { useNavigate } from "react-router";

const ProfileMenu = ({ onLogout, userEmail }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = (e) => {
    e.preventDefault();
    setOpen(false);
    if (onLogout) onLogout();
    navigate("/");
  };

  const handleToggleMenu = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="dropdown" ref={menuRef} style={{ position: "relative" }}>
      <Button
        className="btn btn-link p-0 border-0 shadow-none"
        onClick={handleToggleMenu}
        aria-label="Open profile menu"
        aria-expanded={open ? "true" : "false"}
        tabIndex={0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="bi bi-person-circle"
          style={{ width: '32px', height: '32px', color: 'var(--bs-body-color)' }}
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </Button>
      <DropdownMenu
        className={`dropdown-menu dropdown-menu-end ${open ? 'show' : ''}`}
        style={{
          transition: 'opacity 0.15s, transform 0.15s',
          minWidth: 160,
          right: 0,
          left: 'auto',
          maxWidth: '90vw',
          overflow: 'auto',
          position: 'absolute',
          zIndex: 1050
        }}
      >
        <li className="px-3 text-secondary small">{userEmail}</li>
        <li><hr className="dropdown-divider"/></li>
        <li>
          <a className="dropdown-item text-danger" href="#" onClick={handleLogout}>
            Cerrar sesión
          </a>
        </li>
      </DropdownMenu>
    </div>
  );
};

export default ProfileMenu;
