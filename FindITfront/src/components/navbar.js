import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import myLogo from './logo-removebg.png';

function handleLogout(instance, setDisplaypage, setLoginrole) {
	instance.logoutPopup().catch(e => {
			console.error(e);
	});
	setDisplaypage("home")
	localStorage.setItem("loginrole", null)
	setLoginrole(null)
}

function ResponsiveNavbar(props) {

	//props.setLoginstatus (null, recruitment, customer) //null, recruitment, customer

	// props.loginstatus is either null, 'recruitment' or 'customer'
	
  // use props.setLoginstatus to set login status as null, 'recruitment' or 'customer'

	// if props.loginstatus null, navbar should display buttons for 'Home' and 'Consultants' and the dummy login buttons

	const { instance } = useMsal();

	const isAuthenticated = useIsAuthenticated();
	
	return (
		<Navbar collapseOnSelect expand="lg" bg="warning"   variant="danger">
			<Container>
			
				<Navbar.Brand onClick={() => props.setDisplaypage("home")}><img src={myLogo} width="200" height="75" alt="cam"/></Navbar.Brand>
				
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
		
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link className='navBarLink' onClick={() => props.setDisplaypage("home")}>Home</Nav.Link>
						<Nav.Link className='navBarLink' onClick={() => props.setDisplaypage("consultants")}>Consultants</Nav.Link>
						{props.loginrole === "customer" && isAuthenticated &&

							<Nav.Link className='navBarLink' onClick={() => props.setDisplaypage("yourteams")}>Your contracts</Nav.Link>}

							
						{props.loginrole === "recruitment" && isAuthenticated &&
							<Nav.Link className='navBarLink' onClick={() => props.setDisplaypage("insights")}>Insights</Nav.Link>}
						{isAuthenticated && 
							<Nav.Link className='navBarLink' onClick={() => handleLogout(instance, props.setDisplaypage, props.setLoginrole)}>Log out</Nav.Link>}					
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default ResponsiveNavbar;