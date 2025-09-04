import ProfileMenu from './ProfileMenu';
import COLORS from '../../utils/colors';
import { Navbar, Nav, Container } from 'react-bootstrap';

const CustomNavbar = () => {
    const pages = [
        { name: 'Wines', href: '/wines' },
        { name: 'Grapes', href: '/grapes' },
        { name: 'Regions', href: '/regions' },
        { name: 'Premium', href: '/premium' },
        { name: 'Sommelier AI', href: '/sommelier-ai' },
        { name: 'My Cellar', href: '/my-cellar' },
        
    ];

    return( 
        <>
        
    <Navbar
        expand="lg"
        className="shadow-sm fixed-top"
        bg="light"
        style={{ transition: 'background-color 0.3s ease' }}
    >
        <Container fluid style={{padding: "15px"}}>
            {/* Logo */}
            <Navbar.Brand href="#" className="fs-3 fw-bold mx-3" style={{ fontFamily: 'playfair', color: COLORS.darkGreen }}>
                Vid & Food
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="justify-content-center w-100">
                    {pages.map((page) => (
                        <Nav.Link
                            key={page.name}
                            href={page.href}
                            className="fs-4 rounded mx-3 "
                            style={{
                                fontFamily: 'playfair',
                                color: COLORS.grey,
                                transition: 'color 0.2s ease',
                            }}
                        >
                            {page.name}
                        </Nav.Link>
                    ))}
                </Nav>


                <div className="d-flex align-items-center" style={{ fontFamily: 'playfair', fontWeight: 'bold' }}>
                    <ProfileMenu />
                </div>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    </>
)};

export default CustomNavbar;
