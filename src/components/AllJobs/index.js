/* eslint-disable import/extensions */
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const failureViewImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

const generateInterviewers = () => {
  const timeOptions = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM']
  return Array.from({length: 60}, (_, i) => ({
    id: i + 1,
    name: `Interviewer ${i + 1}`,
    imageUrl: `https://randomuser.me/api/portraits/men/${i % 100}.jpg`,
    phone: `+91-90000${i.toString().padStart(4, '0')}`,
    email: `interviewer${i + 1}@example.com`,
    linkedIn: `https://www.linkedin.com/in/interviewer${i + 1}`,
    timeSlots: [
      timeOptions[Math.floor(Math.random() * timeOptions.length)],
      timeOptions[Math.floor(Math.random() * timeOptions.length)]
    ]
  }))
}

const interviewersList = generateInterviewers()

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkboxInputs: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobsStatus: apiJobsStatusConstants.initial,
  }

  componentDidMount = () => {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }

  onGetProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseProfile = await fetch(profileApiUrl, optionsProfile)

    if (responseProfile.ok === true) {
      const fetchedDataProfile = [await responseProfile.json()]
      const updatedDataProfile = fetchedDataProfile.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedDataProfile,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onGetJobDetails = async () => {
    this.setState({apiJobsStatus: apiJobsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const optionsJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobs = await fetch(jobsApiUrl, optionsJobs)
    if (responseJobs.ok === true) {
      const fetchedDataJobs = await responseJobs.json()
      const updatedDataJobs = fetchedDataJobs.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
        interviewer: interviewersList[Math.floor(Math.random() * interviewersList.length)],
      }))
      this.setState({
        jobsData: updatedDataJobs,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsStatusConstants.failure})
    }
  }

  onChangeCheckbox = event => {
    const {value, checked} = event.target
    this.setState(prevState => {
      const updatedCheckboxInputs = checked
        ? [...prevState.checkboxInputs, value]
        : prevState.checkboxInputs.filter(item => item !== value)

      return {checkboxInputs: updatedCheckboxInputs}
    }, this.onGetJobDetails)
  }

  onChangeRadio = event => {
    this.setState({radioInput: event.target.value}, this.onGetJobDetails)
  }

  onGetCheckBoxesView = () => {
    const {checkboxInputs} = this.state

    return (
      <ul className="filter-list">
        {employmentTypesList.map(eachType => (
          <li key={eachType.employmentTypeId}>
            <input
              type="checkbox"
              id={eachType.employmentTypeId}
              value={eachType.employmentTypeId}
              checked={checkboxInputs.includes(eachType.employmentTypeId)}
              onChange={this.onChangeCheckbox}
            />
            <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  onGetRadioButtonsView = () => {
    const {radioInput} = this.state

    return (
      <ul className="filter-list">
        {salaryRangesList.map(eachRange => (
          <li key={eachRange.salaryRangeId}>
            <input
              type="radio"
              id={eachRange.salaryRangeId}
              name="salary"
              value={eachRange.salaryRangeId}
              checked={radioInput === eachRange.salaryRangeId}
              onChange={this.onChangeRadio}
            />
            <label htmlFor={eachRange.salaryRangeId}>{eachRange.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {checkboxInputs, radioInput, searchInput, jobsData} = this.state
    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="side-bar-container">
            {this.onRenderProfileStatus()}
            <hr className="hr-line" />
            <h1 className="text">Type of Employment</h1>
            {this.onGetCheckBoxesView()}
            <hr className="hr-line" />
            <h1 className="text">Salary Range</h1>
            {this.onGetRadioButtonsView()}
          </div>
          <div className="jobs-container">
            <div>
              <input
                className="search-input"
                type="search"
                value={searchInput}
                placeholder="Search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                data-testid="searchButton"
                type="button"
                className="search-button"
                onClick={this.onSubmitSearchInput}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.onRenderJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
