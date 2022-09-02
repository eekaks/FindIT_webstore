import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import Badge from 'react-bootstrap/Badge';




const SkillBadge = ({skill}) => {
	return (
		<div className='skillbadge'>
			<Badge className='skillbadge' style={{fontSize: 20}} bg="warning" text="dark">{skill}</Badge>
		</div>
	)
}

const HomeGrid = ({setLoginrole, setDisplaypage, loginrole, exampleConsultants}) => {

	const isAuthenticated = useIsAuthenticated()

	return (
		<>
			<div className="loginconsultantcontainer">
				<div className="loginconsultants">
						<div className="randomcontainer">
							<div className="card">
								<img src={`https://robohash.org/${exampleConsultants[0].name}.png`} alt='consultant'/>
									<div className="card__skills"> Skills: {exampleConsultants[0].skills.map((skill) => (
										<SkillBadge key={skill} skill={skill} />
										))}
									</div>
								<div className="card__name">{exampleConsultants[0].name}</div>
							</div>
							<div className="card">
								<img src= {`https://robohash.org/${exampleConsultants[1].name}.png`} alt='consultant'/>
								<div className="card__skills"> Skills: {exampleConsultants[1].skills.map((skill) => (
										<SkillBadge key={skill} skill={skill} />
										))}
									</div>
								<div className="card__name"> {exampleConsultants[1].name}</div>
							</div>
							<div className="card">
								<img src= {`https://robohash.org/${exampleConsultants[2].name}.png`} alt='consultant'/>
								<div className="card__skills"> Skills: {exampleConsultants[2].skills.map((skill) => (
										<SkillBadge key={skill} skill={skill} />
										))}
									</div>
								<div className="card__name"> {exampleConsultants[2].name}</div>
							</div>
							<div className="card">
								<img src= {`https://robohash.org/${exampleConsultants[3].name}.png`} alt='consultant'/>
								<div className="card__skills"> Skills: {exampleConsultants[3].skills.map((skill) => (
										<SkillBadge key={skill} skill={skill} />
										))}
									</div>
								<div className="card__name"> {exampleConsultants[3].name}</div>
							</div>
							<div className="card">
								<img src= {`https://robohash.org/${exampleConsultants[4].name}.png`} alt='consultant'/>
								<div className="card__skills"> Skills: {exampleConsultants[4].skills.map((skill) => (
										<SkillBadge key={skill} skill={skill} />
										))}
									</div>
								<div className="card__name"> {exampleConsultants[4].name}</div>
							</div>
						</div>
						<p>Find IT professionals</p>
						<div className='loginbuttons'>
					{isAuthenticated
						? <SignOutButton setLoginrole={setLoginrole} setDisplaypage={setDisplaypage} text="Logout"/>
						:	<>
								<div className='loginbutton' >
									<SignInButton setLoginrole={setLoginrole} user='customer' text="Customer login"/>
								</div>
								<div className='loginbutton' >
										<SignInButton setLoginrole={setLoginrole} user='recruitment' text="Recruitment login"/>
								</div>
							</>
							}
						</div>
				</div>
			</div> 
			{/* <div className="logincardgrid">
			{ (!isAuthenticated || loginrole === 'customer') &&
				<Card border="warning" style={{ width: '18rem' }}>
					<Card.Img variant="top" src={businessman} width="100"/>
					<Card.Body>
					<Card.Title>Customer Login</Card.Title>
					<Card.Text>
					</Card.Text>
					{isAuthenticated
							? <SignOutButton setLoginrole={setLoginrole} setDisplaypage={setDisplaypage} text="Customer logout"/>
							:	<SignInButton setLoginrole={setLoginrole} user='customer' text="Customer login"/>
								}
					</Card.Body>
				</Card>
			}
			{ (!isAuthenticated || loginrole === 'recruitment') &&
				<Card border="warning" style={{ width: '18rem' }}>
					<Card.Img variant="top" src={people} width="100" />
					<Card.Body>
					<Card.Title>Recruitment Login</Card.Title>
					<Card.Text>
					</Card.Text>
					{isAuthenticated
							? <SignOutButton setLoginrole={setLoginrole} setDisplaypage={setDisplaypage} text="Recruitment logout" />
							:	<SignInButton setLoginrole={setLoginrole} user='recruitment' text="Recruitment login"/>
					}
					</Card.Body>
				</Card>
			}
			</div> */}
		</>
  )
}

export default HomeGrid;