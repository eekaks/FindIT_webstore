import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import { useContext } from 'react';
import AccordionContext from 'react-bootstrap/AccordionContext';


function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <button 
      type="button"
      style={{ backgroundColor: isCurrentEventKey ? 'yellow' : 'lightgrey' }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}


const TeamMember = ({consultant}) => {

	const imageUrl = `https://robohash.org/${consultant.name}.png`

  return (
    <Accordion>
      <Card>
        <Card.Header>
					<img alt='consultant' className='contractconsultantimage' src={imageUrl} width='35'></img>
					<ContextAwareToggle eventKey="0">{consultant.name}</ContextAwareToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
						<p>Experience: {consultant.experience} years</p>
						<p>Salary: {consultant.salary} EUR</p>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}


export default TeamMember;


