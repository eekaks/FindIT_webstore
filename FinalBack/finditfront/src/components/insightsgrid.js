import { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, Sector, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import "./card.css";

// this component should display various sorts of insights in an easy-to-read manner for the recruitment firms
// the insights could be information and graphs on the amount of consultants,
// how many available/recruited, how many contracts, lengths and values of contracts etc

const InsightsGrid = ({employmentstatus}) => {

  	const consData = [
		{name: "Employed", value: employmentstatus.employedAmount}, 
		{name: "Unemployed", value: employmentstatus.unemployedAmount}
	]
	
	const COLORS = ["#008000", "#ff0000"];

	const renderActiveShape = (props) => {
		const RADIAN = Math.PI / 180;
		const {
		  cx,
		  cy,
		  midAngle,
		  innerRadius,
		  outerRadius,
		  startAngle,
		  endAngle,
		  fill,
		  payload,
		  percent,
		  value
		} = props;
		const sin = Math.sin(-RADIAN * midAngle);
		const cos = Math.cos(-RADIAN * midAngle);
		const sx = cx + (outerRadius + 10) * cos;
		const sy = cy + (outerRadius + 10) * sin;
		const mx = cx + (outerRadius + 30) * cos;
		const my = cy + (outerRadius + 30) * sin;
		const ex = mx + (cos >= 0 ? 1 : -1) * 22;
		const ey = my;
		const textAnchor = cos >= 0 ? "start" : "end";
	  
		return (
		  <g>
			<text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
			  {payload.name}
			</text>
			<Sector
			  cx={cx}
			  cy={cy}
			  innerRadius={innerRadius}
			  outerRadius={outerRadius}
			  startAngle={startAngle}
			  endAngle={endAngle}
			  fill={fill}
			/>
			<Sector
			  cx={cx}
			  cy={cy}
			  startAngle={startAngle}
			  endAngle={endAngle}
			  innerRadius={outerRadius + 6}
			  outerRadius={outerRadius + 10}
			  fill={fill}
			/>
			<path
			  d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
			  stroke={fill}
			  fill="none"
			/>
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text
			  x={ex + (cos >= 0 ? 1 : -1) * 12}
			  y={ey}
			  textAnchor={textAnchor}
			>{`${value}`}</text>
			<text
			  x={ex + (cos >= 0 ? 1 : -1) * 12}
			  y={ey}
			  dy={18}
			  textAnchor={textAnchor}
			>
			  {`(${(percent * 100).toFixed(2)}%)`}
			</text>
		  </g>
		);
	  };

	const [activeIndex, setActiveIndex] = useState(0);
	const onPieEnter = useCallback(
		(_, index) => {
		setActiveIndex(index);
		checkIndex(index);
		},
		[setActiveIndex]
	);

	const checkIndex = (props) => {
		if (props == 0) {
			document.getElementById('unempBarChart').style.display = "none";
			document.getElementById('empBarChart').style.display = "block";
		}
		else if (props == 1) {
			document.getElementById('empBarChart').style.display = "none";
			document.getElementById('unempBarChart').style.display = "block";
		}
	}

	var empSkills = employmentstatus.employedSkills;
	var empSkillCount = employmentstatus.employedSkillCount;
	var empSkillData = [];
	for (let index = 0; index < empSkills.length; index++) {
		empSkillData.push({name: empSkills[index], määrä: empSkillCount[index]});
	}

	var unempSkills = employmentstatus.unemployedSkills;
	var unempSkillCount = employmentstatus.unemployedSkillCount;
	var unempSkillData = [];
	for (let index = 0; index < unempSkills.length; index++) {
		unempSkillData.push({name: unempSkills[index], määrä: unempSkillCount[index]});
	}

	return (
		<div className='recharts-wrapper container'>
			<br></br>
			<h2>Currently Employed vs Unemployed</h2>
			<PieChart width={400} height={230}>
				<Pie
					dataKey="value"
					data={consData}
					cx={200}
					cy={100}
					innerRadius={50}
					outerRadius={70}
					activeIndex={activeIndex}
        			activeShape={renderActiveShape}
					onMouseEnter={onPieEnter}
					fill="#8884d8"
				>
					{consData.map((entry, index) => (
          				<Cell key={`cell-${index}`} fill={COLORS[index]}/>
        			))}
				</Pie>
			</PieChart>
			<div id='empBarChart'>
				<h3>Skills of Employed Consultants</h3>
				<ResponsiveContainer width='99%' height={280}>
					<BarChart
						width={1500}
						height={300}
						data={empSkillData}
					>
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Bar dataKey="määrä" fill="#FFAA33" />
					</BarChart>
				</ResponsiveContainer>
			</div>
			<div id='unempBarChart' style={{display: 'none'}}>
				<h3>Skills of Unemployed Consultants</h3>
				<ResponsiveContainer width='99%' height={280}>
					<BarChart
						width={1500}
						height={300}
						data={unempSkillData}
					>
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Bar dataKey="määrä" fill="#FFAA33" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

export default InsightsGrid;