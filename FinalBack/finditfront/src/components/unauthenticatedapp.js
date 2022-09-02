import ConsultantGrid from "./consultantgrid";
import HomeGrid from "./homegrid";

// the unauthenticatedapp should have all the permissions that recruitmentapp has, except for the ability to see teams or actually recruit teams

const UnAuthenticatedApp = ({displaypage, setLoginrole, loginrole, setDisplaypage, consultants, exampleConsultants}) => {
	if (displaypage === 'consultants')
	return (
		<ConsultantGrid loginrole={loginrole} consultants={consultants}/>
	)
	else if (displaypage === 'home' && exampleConsultants.length !== 0)
	return (
		<HomeGrid setLoginrole={setLoginrole} loginrole={loginrole} setDisplaypage={setDisplaypage} exampleConsultants={exampleConsultants}/>
	)
}

export default UnAuthenticatedApp;