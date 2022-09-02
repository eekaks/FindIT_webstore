import ConsultantGrid from "./consultantgrid";
import InsightsGrid from "./insightsgrid";
import HomeGrid from "./homegrid";
import { useEffect, useState, useCallback } from 'react';
import contractService from '../services/contractService';

// this component should render two things, either a ConsultantGrid or InsightsGrid depending on what it receives as a prop

const RecruitmentApp = ({displaypage, setLoginrole, loginrole, setDisplaypage, consultants, setConsultants, exampleConsultants}) => {

	const [employmentstatus, setEmploymentstatus] = useState("")

	useEffect(() => {
    contractService.getEmployment()
      .then(employmentstatus => {
        setEmploymentstatus(employmentstatus)
      })
  	}, [])

	if (displaypage === 'consultants')
		return (
			<ConsultantGrid loginrole={loginrole} consultants={consultants} setConsultants={setConsultants} />
		)
	else if (displaypage === 'insights' && employmentstatus !== "")
		return (
			<InsightsGrid employmentstatus={employmentstatus}/>
		)
	else if (displaypage === 'home' && exampleConsultants.length !== 0)
		return (
			<HomeGrid setLoginrole={setLoginrole} loginrole={loginrole} setDisplaypage={setDisplaypage} exampleConsultants={exampleConsultants}/>
		)
}

export default RecruitmentApp;