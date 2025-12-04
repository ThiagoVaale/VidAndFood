import ProfileMenu from "./ProfileMenu";
import COLORS from "../../../utils/colors";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./CustomNavBar.css";

const CustomNavbar = () => {
  const pages = [
    { name: "Home", href: "/home" },
    { name: "Wines", href: "/wines" },
    { name: "Sommelier AI", href: "/sommelier-ai" },
  ];

  return (
    <Navbar expand="lg" className="shadow-sm fixed-top custom-navbar" bg="light">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/home" className="brand-title">
          Vid & Food
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="custom-nav-items">
            {pages.map((page) => (
              <Nav.Link
                key={page.name}
                as={NavLink}
                to={page.href}
                end
                className={({ isActive }) =>
                  ["nav-link-main", isActive ? "nav-link-main-active" : ""].join(" ")
                }
              >
                {page.name}
              </Nav.Link>
            ))}
          </Nav>

          <div className="profile-container ms-auto">
            <ProfileMenu />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
