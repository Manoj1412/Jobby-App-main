import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-heading">Ace Every Interview with the Right Mentor</h1>
        <p className="home-description">
          Connect with Industry experts from top companies, Explore mock interviewers, get real insights,
          and sharpen your skills with personalized feedback.
        </p>
        <Link to="/jobs">
          <button type="button" className="shop-now-button">
            Find Interviewers
          </button>
        </Link>
      </div>
    </div>
  </>
)
export default Home
