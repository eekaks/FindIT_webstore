import Table from 'react-bootstrap/Table';
import TeamMembersButton from './TeamMembersButton.js';
import contractService from '../services/contractService.js';
import Button from 'react-bootstrap/esm/Button';
import { useMsal } from '@azure/msal-react';

const TableHeads = ({numberOfColumns}) => {
	let heads = []
	for (let i = -1; i < numberOfColumns; i++) {
    heads.push(<th key={i}></th>);
	}
	return heads
}

const TeamsGrid = ({yourContracts, setYourContracts}) => {

	const { accounts } = useMsal()

	let numberOfColumns = 3;

	if (yourContracts !== '')
	{
		yourContracts.forEach(element => {
			if (element.consults.length > numberOfColumns)
			{
				numberOfColumns = element.consults.length
			}
		});
	}

	const endContract = (contract) => {

		const answer = window.confirm('Are you sure you want to end contract?')

		if (!answer) {
			return
		}

		const newContract = {
			id: contract.id,
			title: contract.title,
			customerId: accounts[0].homeAccountId,
			startDate: contract.startDate,
			endDate: new Date(),
			totalPrice: contract.totalPrice,
			consults: contract.consults
		}

		contractService.update(contract.id, newContract).then(returnedContract => {
			contractService.getCustomer(accounts[0].homeAccountId)
      .then(contracts => {
        setYourContracts(contracts)
      })
			})
	}

	
		return (
			<>
			<div>
				<Table responsive="sm">
				<thead>
					<tr>
					<th>Contract</th>
					<TableHeads numberOfColumns={numberOfColumns} />
					</tr>
				</thead>
				<tbody>
					{yourContracts.map((contract)=>(
						<tr key={contract.id}>
							<td>
								{contract.title}
							</td>
							{contract.consults.map((consultant)=>(
								<td key={consultant.id}><TeamMembersButton consultant={consultant}/></td>
							))}
							<td>
								{new Date(contract.endDate.slice(0, 10)) < new Date(Date.now())
									? <Button className='contractbutton' variant="warning">Contract ended</Button>
									: <Button className='contractbutton' variant="secondary" onClick={() => endContract(contract)}>End contract</Button>
									}							
							</td>
						</tr>
					) ) }
				</tbody>
				</Table>
			</div>
			</>
			);
	
}

export default TeamsGrid;

