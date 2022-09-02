import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FilterSideBar from './filtersidebar';
import CardGrid from './cardgrid';
import ShoppingCart from './shoppingcart';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import consultantService from '../services/consultantService';
import Spinner from 'react-bootstrap/Spinner';


// import createPersistedState from 'use-persisted-state';

// this component should hold the React state for consultants to show in CardGrid AND for consultants to show in ShoppingCart
// on first load, a useEffect hook should load up a limited random selection of consultants, ShoppingCart should load up as null
// after filters are applied in FilterSideBar, it updates the state in this component using consultantService
// after consultants are added to the shopping cart, the state is updated and passed on to ShoppingCart

// if viewing as recruitment, you should have the ability to CRUD the consultants

const SkillBadge = ({skill}) => {
	return (
		<div className='skillbadge'>
			<Badge className='skillbadge' style={{fontSize: 28}} bg="warning" text="dark">{skill}</Badge>
		</div>
	)
}

const NewSkillBadge = ({skill, editSkills, setEditSkills}) => {

	const handleNewSkillClick = () => {
		if (editSkills.includes(skill))
		{
			setEditSkills(editSkills.filter(oldskill => oldskill !== skill))
		}
		else
		{
			setEditSkills(editSkills.concat(skill))
		}
	}
	return (
		<Badge className='filterskillbadge' onClick={() => handleNewSkillClick()} bg={editSkills.includes(skill) ? 'danger' : 'warning'} text="dark">{skill}</Badge>
	)
}

const ConsultantGrid = ({loginrole, consultants, setConsultants, customerContracts, setCustomerContracts}) => {

	const useStickyState = (defaultValue, key) => {
		const [value, setValue] = useState(() => {
			const stickyValue = window.localStorage.getItem(key);
			return stickyValue !== null
				? JSON.parse(stickyValue)
				: defaultValue;
		});
		useEffect(() => {
			window.localStorage.setItem(key, JSON.stringify(value));
		}, [key, value]);
		return [value, setValue];
	}

	const [nameFilter, setNameFilter] = useState('')
	const [salaryFilter, setSalaryFilter] = useState(10000)
	const [expFilter, setExpFilter] = useState(0)
	const [skillFilter, setSkillFilter] = useState([])
	const [shoppingcart, setShoppingcart] = useStickyState([], "shoppingcart")

	const [showModal, setShowModal] = useState(false)
	const [modalConsultant, setModalConsultant] = useState(undefined)

	const [edit, setEdit] = useState(false)
	const [editName, setEditName] = useState('')
	const [editSalary, setEditSalary] = useState('')
	const [editExp, setEditExp] = useState('')
	const [editDetails, setEditDetails] = useState('')
	const [editSkills, setEditSkills] = useState([])

	const [imageUrl, setImageUrl] = useState('')

	const filterCheck = (consultant) => {
		if (!(nameFilter === ''))
		{
			if (!consultant.name.toLowerCase().includes(nameFilter.toLowerCase()))
			{
				return false
			}
		}
		if (salaryFilter > 3199) 
		{
			if (consultant.salary > salaryFilter)
				{
					return false
				}
		}
		if (consultant.experience < expFilter)
		{
			return false
		}
		
		if (skillFilter.length !== 0)
		{
			let skillExists = true
			skillFilter.forEach(element => {
			if (!(consultant.skills.includes(element)))
			{
				skillExists = false
			}
			});
			return skillExists
		}
		return true
	}

	const handleModalClose = () => {
		setShowModal(false)
		setModalConsultant(undefined)
		setEdit(false)
	}

	const handleItemClick = (consultant) => {
		if (showModal === false)
		{
			setModalConsultant(consultant)
			setImageUrl(`https://robohash.org/${consultant.name}.png`)
			setShowModal(true)
		}
		else {
			setShowModal(false)
			setImageUrl('')
			setModalConsultant(undefined)
		}
	}

	const handleImageChange = () => {
		if (editName !== '')
		{
			setImageUrl(`https://robohash.org/${editName}.png`)
		}
	}

	const addConsultant = async (consultant) => {

	
		if (shoppingcart === null)
		{
			setShoppingcart([consultant])
			setShowModal(false)
		}
		else {
			const exists = shoppingcart.find(cartitem => cartitem.id === consultant.id)
			if (!exists)
			{
				setShoppingcart(shoppingcart.concat(consultant))
				setShowModal(false)
			}
			else {
				window.alert('Consultant already in the team!')
			}
		}
	}

	const handleEditClick = (consultant) => {
		if (!edit)
		{
			setEditName(consultant.name)
			setEditSalary(consultant.salary)
			setEditExp(consultant.experience)
			setEditDetails(consultant.details)
			setEditSkills(consultant.skills)
		}
		setEdit(!edit)
	}

	const deleteConsultant = (consultant) => {
		const result = window.confirm(`Delete ${consultant.name} ?`)
    if (result === true) {
      consultantService.remove(consultant.id)
        .then(deletedItem => {
        setConsultants(consultants.filter(oldItem => oldItem.id !== consultant.id))
      })
    }
		setShowModal(false)
		window.alert('Consultant deleted!')
	}

	const updateConsultant = () => {

		const upConsultant = {
			id: modalConsultant.id,
			name: editName,
			salary: editSalary,
			experience: editExp,
			available: modalConsultant.available,
			details: editDetails,
			skills: editSkills,
			contracts: modalConsultant.contracts
		}

		setModalConsultant(upConsultant)
		setEdit(false)

		consultantService.update(upConsultant.id, upConsultant).then(returnedConsultant => {
			consultantService.getAll()
      .then(consultants => {
        setConsultants(consultants)
      })
			})
	}

	const allSkills = ["Python", "Javascript", "HTML", "CSS", "React", "C#", "SQL", "Entity Framework", "Unit testing", ".NET Core", "ASP.NET", "Azure", "Git", "REST", "Angular", "Vue", "AWS", "Rust", "Go", "PHP", "Swift", "C", "C++", "TypeScript"]

  return (
	<>
		<Container fluid className="vh-100 d-flex flex-column">
		<Row className="h-100">
			<Col xs={2} className='sidebar'>
				<FilterSideBar
					nameFilter={nameFilter}
					setNameFilter={setNameFilter}
					salaryFilter={salaryFilter}
					setSalaryFilter={setSalaryFilter}
					expFilter={expFilter}
					setExpFilter={setExpFilter}
					skillFilter={skillFilter}
					setSkillFilter={setSkillFilter}
					loginrole={loginrole}
					consultants={consultants}
					setConsultants={setConsultants}
					/>
			</Col>
			<Col xs={8} className='centergrid'>
				{ consultants.length === 0
				? <div className='cardgridspinnercontainer'>
						<div className='cardgridspinnerbox'>
							<Spinner animation="border" className='cardgridspinner'/>
						</div>
					</div>
				: <CardGrid
					className='cardgrid'
					loginrole={loginrole}
					consultants={consultants.filter(consultant => filterCheck(consultant))}
					setConsultants={setConsultants}
					shoppingcart={shoppingcart}
					setShoppingcart={setShoppingcart}
					addConsultant={addConsultant}
					handleItemClick={handleItemClick}
					/> }
			</Col>
			<Col xs={2} className='sidebar'>
				<ShoppingCart
					className='shoppingcart'
					loginrole={loginrole} 
					customerContracts={customerContracts}
					setCustomerContracts={setCustomerContracts}
					shoppingcart={shoppingcart}
					setShoppingcart={setShoppingcart}
					showModal={showModal}
					setShowModal={setShowModal}
					setModalConsultant={setModalConsultant}
					handleItemClick={handleItemClick}
				/>
			</Col>
		</Row>
		</Container>
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
            		{edit ? <input className='input' value={editName} onBlur={() => handleImageChange()} onChange={event => setEditName(event.target.value)} /> : modalConsultant.name}
          		</Modal.Title>
        	</Modal.Header>
        	<Modal.Body>
						<div className='pictureandskills'>
							<div className='modalpicture'>
								<img src={imageUrl} alt='consultant' />
							</div>
							<div className='modalskills'>
								{edit
								 	?  allSkills.map((skill) => (
										<NewSkillBadge key={skill} skill={skill} editSkills={editSkills} setEditSkills={setEditSkills} />
								 ))
									: modalConsultant.skills.map((skill) => (
										<SkillBadge key={skill} skill={skill} />
								))}
							</div>
						</div>
						<p>Experience in the IT industry: {edit ? <input className='input' value={editExp} onChange={event => setEditExp(event.target.value)}/> : modalConsultant.experience} years</p>
						<p>Salary request: {edit ? <input className='input' value={editSalary} onChange={event => setEditSalary(event.target.value)}/> : modalConsultant.salary} EUR</p>
						<p>{edit ? <input className='input inputdetails' value={editDetails} onChange={event => setEditDetails(event.target.value)}/> : modalConsultant.details ? modalConsultant.details : 'No further details'}</p>
						<p>Previous contracts: </p>
						{modalConsultant.contracts.map((contract) => (
							<p key={contract.id}>{contract.title}</p>
						))}

        	</Modal.Body>
					<Modal.Footer>
						{loginrole === 'recruitment' &&
						<>
						<Button variant="secondary" onClick={() => handleEditClick(modalConsultant)}>
							Edit
						</Button>
						<Button variant="secondary" onClick={() => updateConsultant()}>
							Save
						</Button>
						<Button variant="danger" onClick={() => deleteConsultant(modalConsultant)}>
							Delete
						</Button> </> }
						<Button variant="primary" onClick={() => addConsultant(modalConsultant)} >
							Add to cart
						</Button>
        	</Modal.Footer>
      	</Modal>}
	</>
	
  );
}

export default ConsultantGrid;