import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { useMsal } from "@azure/msal-react";
import contractService from '../services/contractService';
import { useState } from 'react';


// this component should receive the consultants selected to the shopping cart in pagegrid.js
// the consultants should be displayed in smaller 'cards' or whatever feels suitable and be allowed to be clicked to make them big and
// clicked to be deleted from the cart

const ShoppingCartItem = ({consultant, handleItemClick}) => {

	const imageUrl = `https://robohash.org/${consultant.name}.png`
	
	return (
		<div className='cartitem' onClick={() => handleItemClick(consultant)}>
				<img alt='consultant' src={imageUrl} width='50'></img>
				{consultant.name}
		</div>
	)
}

const SkillBadge = ({skill}) => {
	return (
		<div className='skillbadge'>
			<Badge className='skillbadge' bg="warning" text="dark">{skill}</Badge>
		</div>
	)
}

const CartStats = ({shoppingcart}) => {
	let expsum = 0
	let salarysum = 0
	let teamskills = []

	if (shoppingcart !== null)
	{
		shoppingcart.forEach(element => {
			expsum += element.experience
			salarysum += element.salary
			element.skills.forEach(skill => {
				if (!teamskills.includes(skill))
				{
					teamskills = teamskills.concat(skill)
					teamskills.sort()
				}
			})
		})
	}

	return (
		<>
			<p>Average experience: {expsum === 0 ? 0 : Math.round((expsum/shoppingcart.length) * 10) / 10} years</p>
			<p>Total monthly salary: {salarysum} EUR</p>
			<p>Skills in the team: </p>
			{teamskills.map(skill => (
				<SkillBadge key={skill} skill={skill}/>
			))}
		</>
	)
}

const ShoppingCart = ({loginrole, customerContracts, setCustomerContracts, shoppingcart, setShoppingcart, showModal, setShowModal, setModalConsultant, handleItemClick}) => {

	const [startdate, setStartdate] = useState('')
	const [enddate, setEnddate] = useState('')
	const [contractName, setContractname] = useState('')

	const { accounts } = useMsal()

	const hireConsultants = () => {
		
		if (contractName === '')
		{
			window.alert('Enter contract name!')
			return
		}
		if (startdate === null || enddate === null)
		{
			window.alert('Enter contract dates!')
			return
		}
		if (startdate > enddate)
		{
			window.alert('End date before start date!')
			return
		}

		let salarysum = 0

		shoppingcart.forEach(element => {
			salarysum += element.salary
		})
		
		const newContract = {
			title: contractName,
			customerId: accounts[0].homeAccountId,
			startDate: startdate,
			endDate: enddate,
			totalPrice: salarysum,
			consults: shoppingcart
		}

		contractService.create(newContract)
			.then(returnedContract => {
				contractService.getCustomer(accounts[0].homeAccountId)
					.then(contracts => {
					setCustomerContracts(contracts)
		  })
				// setCustomerContracts(customerContracts === '' ? [returnedContract]: customerContracts.concat(returnedContract))
			}
				)
		
		setShoppingcart([])
		setStartdate('')
		setEnddate('')
		setContractname('')
		window.alert('Contract signed!')
	}

	const clearConsultants = () => {
		setShoppingcart([])
		setStartdate('')
		setEnddate('')
		setContractname('')
	}

	const cartEmpty = shoppingcart === null

	return (
		<div className='shoppingcart'>
		<h3>Your contract: </h3>
		<CartStats shoppingcart={shoppingcart} />
		{!cartEmpty && 
		<Stack gap={2} className='cart'>
			{shoppingcart.map((cartitem) => (
				<ShoppingCartItem key={cartitem.id} consultant={cartitem} handleItemClick={handleItemClick} />
			))}
		</Stack> }
		{!cartEmpty && 
		<>
			<div>
				Contract name: 
				<input value={contractName} onChange={event => setContractname(event.target.value)}></input> <br />
				Start date: <br />
				<input value={startdate} type='date' onChange={event => setStartdate(event.target.value)}></input> <br />
				End date: <br />
				<input value={enddate} type='date' onChange={event => setEnddate(event.target.value)}></input>
			</div>
			<div className='cartbuttons'>
				<Button className='cartbutton' variant='warning' size='sm' onClick={() => clearConsultants()}>Clear</Button>
				{loginrole === 'customer' &&
				<Button className='cartbutton' variant='warning' size='sm' onClick={() => hireConsultants()}>Hire</Button>
				}
			</div>
		</>
		}
		</div>
	)
}

export default ShoppingCart;