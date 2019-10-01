import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './home.css';

class Home extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			candidates: [],
			totalCandidates: null,
			totalSkills: null,
		}
	}
	
	componentDidMount() {
		this.getCandidates();
		this.getTotals();
	}

	getTotals() {
		axios.get('http://localhost:4000/totals')
		.then(response => {
			this.setState({
				totalCandidates: response.data.payload.candidates,
				totalSkills: response.data.payload.unique_skills,
			});
		})
	}

	getRowsForJobTitle(candidate, index, candidates) {
		let rowCount = 0;
		for (let i = index; i < index + candidate.total_job_candidates; i++) {
			rowCount += candidates[i].skill_count;
		}
		return rowCount;
	}

	getCandidates() {
		axios.get('http://localhost:4000/candidates')
    	.then(response => {
    		response.data.payload.map((candidate, index) => {
    			candidate.skills = candidate.skills.split(',');
    			candidate.skillCount = candidate.skills.length;
    			if (index === 0 || candidate.job_name !== response.data.payload[index - 1].job_name) {
    				candidate.printJobName = true;
    				candidate.jobRows = this.getRowsForJobTitle(candidate, index, response.data.payload);
    			}
    			return candidate;
    		});
    		this.setState({candidates: response.data.payload});
    	});
	}

	renderCandidateSkills(skills) {
		return skills.map((skill, index) => {
			return (
				<tr key={index}>
					<td>{skill}</td>
				</tr>
			)
		})
	}

	renderJobName(candidate, index) {
		if (candidate.printJobName) {
			return (
				<td rowSpan={candidate.jobRows} className="job-name">{candidate.job_name}</td>
			)
		}
	}

	renderCandidateRows() {
		return this.state.candidates.map((candidate, index) => {
			return 	(
				<React.Fragment key={candidate.id}>
					<tr>
						{this.renderJobName(candidate, index)}
						<td rowSpan={candidate.skills.length} className="applicant-name">{candidate.name}</td>
						<td rowSpan={candidate.skills.length}><a href={candidate.email}>{candidate.email}</a></td>
						<td rowSpan={candidate.skills.length}><a href={candidate.website}>{candidate.website}</a></td>
						<td>{candidate.skills[0]}</td>
						<td rowSpan={candidate.skills.length}>Deleniti debitis soluta magni ipsum perspiciatis in itaque eligendi. Modi quidem qui nisi autem vel. Iste non quia dolores quo excepturi corrupti et nobis.</td>
					</tr>
					{this.renderCandidateSkills(candidate.skills.slice(1))}
				</React.Fragment>
			)
		})
	}

	render() {
		return (
			<table className="job-applicants">
		        <thead>
		          <tr>
		            <th>Job</th>
		            <th>Applicant Name</th>
		            <th>Email Address</th>
		            <th>Website</th>
		            <th>Skills</th>
		            <th>Cover Letter Paragraph</th>
		          </tr>
		        </thead>
		        <tbody>
		        	{ this.renderCandidateRows() }
		        </tbody>
		        <tfoot>
		          <tr>
		            <td colSpan="6">{this.state.totalCandidates} Applicants, {this.state.totalSkills} Unique Skills</td>
		          </tr>
		        </tfoot>
		    </table>
		)
	}
}

ReactDOM.render(
  <Home />,
  document.getElementById('root')
);

export default Home;