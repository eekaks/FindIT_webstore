import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import Accordion from 'react-bootstrap/Accordion';
// import image from '../images/eetulaine.png'
import Pagination from './pagination.js'
import { useState } from 'react';
import Badge from 'react-bootstrap/Badge';

// this component should receive consultants to display as props from PageGrid
// the consultants should be rendered as Cards
// click on the card, it opens as a bigger card to display more detailed information and to allow update and delete if logged in as recruitment firm
// maybe use React Bootstrap Modal for the popup?
// might need to define the card ourselves for freedom of styling

const ConsultantCard = ({consultant, shoppingcart, setShoppingcart, addConsultant, handleItemClick}) => {

	const imageUrl = `https://robohash.org/${consultant.name}.png`

	return (
		<Col key={consultant.id}>
          <Card bsPrefix='cardgridoutline'>
            <Card.Img variant="top" className='cardpicture' src={imageUrl} alt= "Card image" onClick={() => handleItemClick(consultant)}/>
            <Accordion bsPrefix='accordionoutline'>
            <Accordion.Item eventKey='0'>
            <Accordion.Header bsPrefix='accordionhead'> <Card.Title> {consultant.name} </Card.Title></Accordion.Header>
            <Accordion.Body><Card.Body>
              <ListGroup className="list-group-flush">
              <ListGroup.Item>Recruitment firms name</ListGroup.Item>
              <ListGroup.Item>Skills: {consultant.skills} </ListGroup.Item>
              <ListGroup.Item>Salary: {consultant.salary} </ListGroup.Item>
              <ListGroup.Item><Button variant='primary' size='sm' onClick={() => addConsultant(consultant)}>Add</Button></ListGroup.Item>
            </ListGroup>
            </Card.Body></Accordion.Body>
            </Accordion.Item>
            </Accordion>
          </Card>
        </Col>
	)
}

const SkillBadge = ({skill}) => {
	return (
		<Badge className='skillbadge' style={{fontSize: 9}} bg="warning" text="dark">{skill}</Badge>
	)
}

const ConsultantCardv2 = ({consultant, shoppingcart, setShoppingcart, addConsultant, handleItemClick}) => {
	

	const imageUrl = `https://robohash.org/${consultant.name}.png`

	return (
		<div className='cardv2grid'>
			<div className='cardv2 hvr-glow' onClick={() => handleItemClick(consultant)}>
				<div className='cardv2top'>
					<div className='cardv2image'>
						<img src={imageUrl} alt='consultant' width="85"></img>
					</div>
					<div className='cardv2skills'>
						{consultant.skills.map((skill) => (
							<SkillBadge key={skill} skill={skill} />
						))}
					</div>
				</div>
				<div className='cardv2bottom'>
					<div className='cardinfo'>
						<strong>{consultant.name}</strong>
						<p className='cardtext'>Experience: {consultant.experience} years <br />
						Salary: {consultant.salary} EUR</p>
					</div>
				</div>
			</div>
		</div>
	)
}

const CardGrid = ({loginrole, consultants, setConsultants, shoppingcart, setShoppingcart, addConsultant, handleItemClick}) => {

	const allConsultantsCount = consultants.length;
  const consultantsPerPage = 32
  const [currentPage, setCurrentPage] = useState(1);

	const lastConsultantNumber = currentPage * consultantsPerPage;
  const firstConsultantIndex = lastConsultantNumber - consultantsPerPage;
  const limitedConsultants = consultants.slice(
    firstConsultantIndex,
    lastConsultantNumber
  );

	if (allConsultantsCount === 0)
	{
		return (
			<div className='cardgridspinnercontainer'>
				<div className='cardgridspinnerbox'>
					<p>No consultants match the criteria!</p>
				</div>
			</div>
		)
	}
	else {
		return (
			<div className='cardgrid'>
				{limitedConsultants.map((consultant) => (
					<ConsultantCardv2 key={consultant.id} consultant={consultant} shoppingcart={shoppingcart} setShoppingcart={setShoppingcart} consultants={consultants} addConsultant={addConsultant} handleItemClick={handleItemClick} />
				))}
				{/* <Row xs={1} md={4} className="g-4">
				{limitedConsultants.map((consultant) => (
					<ConsultantCard key={consultant.id} consultant={consultant} shoppingcart={shoppingcart} setShoppingcart={setShoppingcart} consultants={consultants} addConsultant={addConsultant} handleItemClick={handleItemClick} />
				))}
				</Row> */}
				<div className='paginationbox'>
					<Pagination
								className='pagination'
								itemsCount={allConsultantsCount}
								itemsPerPage={consultantsPerPage}
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								alwaysShown={false}
							/>
				</div>
			</div>
			);
	}
}

export default CardGrid;