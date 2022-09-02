import TeamsGrid from "./teamsgrid";
import HomeGrid from "./homegrid";
import ConsultantGrid from "./consultantgrid";
import contractService from "../services/contractService";
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';

// this component should render two things, the consultantgrid or the teamsgrid depending on what it receives as a prop


const CustomerApp = ({displaypage, setLoginrole, loginrole, setDisplaypage, consultants, exampleConsultants}) => {

	const [yourContracts, setYourContracts] = useState('')
	const { accounts } = useMsal()


	useEffect(() => {
		contractService.getCustomer(accounts[0].homeAccountId)
		  .then(contracts => {
			setYourContracts(contracts)
		  })
	  }, [])

	if (displaypage === 'consultants')
		return (
			<ConsultantGrid loginrole={loginrole} consultants={consultants} customerContracts={yourContracts} setCustomerContracts={setYourContracts}/>
		)
	else if (displaypage === 'yourteams')
		return (
			<div className="teamscontainer"> {yourContracts === '' 
				? 
				<div className='cardgridspinnercontainer'>
					<div className='cardgridspinnerbox'>
						<p>You haven't signed any contracts yet!</p>
					</div>
				</div>
				: <TeamsGrid yourContracts={yourContracts} setYourContracts={setYourContracts}/>
				}
			</div>
		)
	else if (displaypage === 'home' && exampleConsultants.length !== 0)
		return (
			<HomeGrid setLoginrole={setLoginrole} loginrole={loginrole} setDisplaypage={setDisplaypage} exampleConsultants={exampleConsultants}/>
		)
}

export default CustomerApp;