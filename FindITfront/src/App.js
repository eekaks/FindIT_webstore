import './App.css';
import "./components/card.css";
import "./components/navbar.css";
import "./components/card.css";
import "./components/homegrid.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import ResponsiveNavbar from './components/navbar'
import UnAuthenticatedApp from './components/unauthenticatedapp';
import RecruitmentApp from './components/recruitmentapp';
import CustomerApp from './components/customerapp';
import { useEffect, useState } from 'react';
import { useIsAuthenticated } from "@azure/msal-react";
import consultantService from './services/consultantService.js'



function App() {

	const [loginrole, setLoginrole] = useState(null)
	const [displaypage, setDisplaypage] = useState('home')
	const [exampleConsultants, setExampleConsultants] = useState([])
	const [consultants, setConsultants] = useState([])
	

	const isAuthenticated = useIsAuthenticated()

	useEffect(() => {
    consultantService.getRand(5)
      .then(exampleConsultants => {
        setExampleConsultants(exampleConsultants)
      })
  }, [])

	useEffect(() => {
    consultantService.getAll()
      .then(consultants => {
        setConsultants(consultants)
      })
  }, [])

	useEffect(() => {
    if (localStorage.getItem("loginrole") !== null)
		{
			setLoginrole(localStorage.getItem("loginrole"))
		}
  }, [])

  return (
		<div className='page'>
			<ResponsiveNavbar loginrole={loginrole} setLoginrole={setLoginrole} displaypage={displaypage} setDisplaypage={setDisplaypage}/>

			{!isAuthenticated
				?	<UnAuthenticatedApp
					 displaypage={displaypage}
					 setDisplaypage={setDisplaypage}
					 loginrole={loginrole}
					 setLoginrole={setLoginrole}
					 consultants={consultants}
					 exampleConsultants={exampleConsultants}
					 />
				: null }
			
			{loginrole === 'recruitment' && isAuthenticated
				? <RecruitmentApp
					 displaypage={displaypage}
					 setDisplaypage={setDisplaypage}
					 loginrole={loginrole}
					 setLoginrole={setLoginrole}
					 consultants={consultants}
					 setConsultants={setConsultants}
					 exampleConsultants={exampleConsultants}
					  />
				: null }
			
			{loginrole === 'customer' && isAuthenticated
				? <CustomerApp
					 displaypage={displaypage}
					 setDisplaypage={setDisplaypage}
					 loginrole={loginrole}
					 setLoginrole={setLoginrole}
					 consultants={consultants}
					 setConsultants={setConsultants}
					 exampleConsultants={exampleConsultants}
					  /> 
				: null }
			
		</div>
  );
}

export default App;
