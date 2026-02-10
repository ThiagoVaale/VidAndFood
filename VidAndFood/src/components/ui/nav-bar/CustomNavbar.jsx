import ProfileMenu from "./ProfileMenu";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./CustomNavBar.css";

const CustomNavbar = () => {
  const pages = [

    { name: "Vinos", href: "/wines" },
    { name: "Sommelier IA", href: "/sommelier-ai" },
  ];

  return (
    <Navbar
      expand="lg"
      bg="light"
      className="shadow-sm fixed-top custom-navbar"
    >
      <Container fluid className="d-flex align-items-center justify-content-between">

        <Navbar.Brand as={NavLink} to="/home" className="brand-title">
          Vid & Food
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse
          id="basic-navbar-nav"
          className="d-flex align-items-center justify-content-between w-100"
        >
          <Nav className="custom-nav-items d-flex align-items-center">
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

          <div className="profile-container ms-lg-4">
            <ProfileMenu />
          </div>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default CustomNavbar;