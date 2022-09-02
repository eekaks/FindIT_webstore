import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import image from '../images/eetulaine.png'
import consultantService from '../services/consultantService';


// this component is a child of pagegrid.js
// this component should render a selection of filters whose state is kept in a React state
// each time a filter is clicked or updated, the consultantService should be called to update the consultants to display in cardgrid.js

const SkillBadge = ({skill, setSkillFilter, skillFilter}) => {

	const handleSkillClick = () => {
		if (!(skillFilter.includes(skill)))
		{
			setSkillFilter(skillFilter.concat(skill))
		}
		else if (skillFilter.includes(skill))
		{
			setSkillFilter(skillFilter.filter(item => item !== skill))
		}
	}

	return (
		<Badge className='filterskillbadge' onClick={() => handleSkillClick()} bg={skillFilter.includes(skill) ? 'danger' : 'warning'} text="dark">{skill}</Badge>
	)
}

const NewSkillBadge = ({skill, newSkills, setNewSkills}) => {

	const handleNewSkillClick = () => {
		if (newSkills.includes(skill))
		{
			setNewSkills(newSkills.filter(oldskill => oldskill !== skill))
		}
		else
		{
			setNewSkills(newSkills.concat(skill))
		}
	}
	return (
		<Badge className='filterskillbadge' onClick={() => handleNewSkillClick()} bg={newSkills.includes(skill) ? 'danger' : 'warning'} text="dark">{skill}</Badge>
	)
}

const FilterSideBar = ({nameFilter, setNameFilter, salaryFilter, setSalaryFilter, expFilter, setExpFilter, skillFilter, setSkillFilter, loginrole, consultants, setConsultants}) => {

	

	const allSkills = ["Python", "Javascript", "HTML", "CSS", "React", "C#", "SQL", "Entity Framework", "Unit testing", ".NET Core", "ASP.NET", "Azure", "Git", "REST", "Angular", "Vue", "AWS", "Rust", "Go", "PHP", "Swift", "C", "C++", "TypeScript"]

	const [showModal, setShowModal] = useState(false)

	const [newName, setNewName] = useState('')
	const [newExp, setNewExp] = useState(0)
	const [newSalary, setNewSalary] = useState(3200)
	const [newDetails, setNewDetails] = useState('')
	const [newSkills, setNewSkills] = useState([])
	const [newImage, setNewImage] = useState(image)

	const clearFilters = () => {
		setNameFilter('')
		setSalaryFilter(10000)
		setExpFilter(0)
		setSkillFilter([])
	}

	const handleModalClose = () => {
		setShowModal(false)
	}

	const addConsultantToDatabase = (consultants, setConsultants) => {
		if (newName === '')
		{
			window.alert('Enter a name!')
			return
		}
		if (newSkills.length === 0)
		{
			window.alert('Choose at least one skill!')
			return
		}

		const newConsultant = {
			name: newName,
			salary: newSalary,
			experience: newExp,
			available: true,
			details: newDetails,
			skills: newSkills
		}

		consultantService.create(newConsultant).then(() => {
      setConsultants(consultants.concat(newConsultant))
		})
		clearConsultant()
		setShowModal(false)
		window.alert('Consultant added!')
	}

	const clearConsultant = () => {
		setNewName('')
		setNewExp(0)
		setNewSalary(3200)
		setNewDetails('')
		setNewSkills([])
	}

	const handleImageChange = () => {
		if (newName !== '')
		{
			setNewImage(`https://robohash.org/${newName}.png`)
		}
	}

	return (
		<>
			{loginrole === 'recruitment' && 
				<Button className='addbutton' variant='warning' size='sm' onClick={() => setShowModal(true)}>Add new consultant</Button>
			}
			<h3>Search</h3>
			<div className="filtergrid">
				Name: <br /> <input value={nameFilter} onChange={event => setNameFilter(event.target.value)} /> <br />
				Maximum salary: <br /> <input value={salaryFilter} onChange={event => setSalaryFilter(event.target.value)} />
				<div className="slidecontainer">
					<input type="range" min="3200" max="10000" value={salaryFilter} className="slider" id="myRange" onChange={event => setSalaryFilter(event.target.value)} />
				</div>
				Minimum experience: <br /> <input value={expFilter} onChange={event => setExpFilter(event.target.value)} />
				<div className="slidecontainer">
					<input type="range" min="0" max="10" value={expFilter} className="slider" id="myRange" onChange={event => setExpFilter(event.target.value)} />
				</div>
				Skills: <br />
				{allSkills.map(skill => (
					<SkillBadge key={skill} skill={skill} setSkillFilter={setSkillFilter} skillFilter={skillFilter}/>
				))}
			</div>
			<br />
			<Button className='cartbutton' variant='warning' size='sm' onClick={() => clearFilters()}>Clear filters</Button>
			{showModal && <Modal
				show={showModal}
				onHide={() => handleModalClose()}
				dialogClassName="modal-90w"
				aria-labelledby="example-custom-modal-styling-title"
				centered
				size="lg"
			>
						<Modal.Header closeButton>
								<Modal.Title id="example-custom-modal-styling-title" >
								Consultant name: <input className='input' value={newName} onBlur={() => handleImageChange()} onChange={event => setNewName(event.target.value)}/>
								</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div className='pictureandskills'>
								<div className='modalpicture'>
									<img src={newImage} alt='consultant' />
								</div>
								<div className='modalskills'>
									<p>Click to add skills: </p>
									{allSkills.map((skill) => (
										<NewSkillBadge key={skill} skill={skill} newSkills={newSkills} setNewSkills={setNewSkills}/>
									))}
								</div>
							</div>
							<p>Experience in the IT industry:
								<div className='slidecontainer'>
								 <input type="range" min="0" max="10" value={newExp} className="slider" id="myRange" onChange={event => setNewExp(event.target.value)} />
								</div> {newExp} years</p>
							<p>Salary request: 
								<div className='slidecontainer'>
									<input type="range" min="3200" max="10000" value={newSalary} className="slider" id="myRange" onChange={event => setNewSalary(event.target.value)} /> 
									</div> {newSalary} EUR</p>
							<p>Details: <input className='input inputdetails' value={newDetails} onChange={event => setNewDetails(event.target.value)}/></p>
						
						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary" onClick={() => clearConsultant()} >
								Clear
							</Button>
							<Button variant="primary" onClick={() => addConsultantToDatabase(consultants, setConsultants)} >
								Add to database
							</Button>
						</Modal.Footer>
					</Modal>}
		</>
	)
}

export default FilterSideBar;