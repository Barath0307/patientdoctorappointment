import { Container, Nav, Navbar } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import "./Header.css"
import { useAuth } from "../../context/AuthContext";

const Header = () => {

    const { token, clearAuthToken } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuthToken();  // Clear the token from global state and sessionStorage
        navigate('/login');  // Navigate to the login page
    };

    return (
        <>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand to="/"><strong>Patient Doctor Appointment System</strong></Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/patients" className="nav-link">Patients</Nav.Link>
                        <Nav.Link as={Link} to="/doctors" className="nav-link">Doctors</Nav.Link>
                        <Nav.Link as={Link} to="/appointments" className="nav-link">Appointments</Nav.Link>
                    </Nav>
                    <div>
                        {token ? (
                            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                            Logout
                            </button>
                        ) : (
                            <button onClick={() => navigate('/login')} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Login
                            </button>
                        )}
                    </div>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;