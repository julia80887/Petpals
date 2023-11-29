import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function ShelterSignUp() {
    const [error, setError] = useState("");
    const [errorJson, setErrorJson] = useState({});
    const navigate = useNavigate();

    function handle_submit(event) {
        let data = new FormData(event.target);
        console.log(data);


        ajax("/shelter/account/", {
            method: "POST",
            body: data,
        })
            .then(request => request.json())
            .then(json => {
                if ('access_token' in json) {
                    localStorage.setItem('access', json.access);
                    localStorage.setItem('username', data.get('username'));
                    navigate('/pet/details/');
                }
                else if ('detail' in json) {
                    setError(json.detail);
                }
                else if ('error' in json) {
                    setErrorJson(json.errors);
                }
                else {
                    setError("Unknown error while signing in.")
                }
            })
            .catch(error => {
                setError(error);
            });

        event.preventDefault();
    }

    return <main>
        <div className="topnav">
            <Link to="/seeker/signup/" >Pet Seekers</Link>
            <Link to="/shelter/signup/" className="active">Pet Shelters</Link>
        </div>


        <div className="outerContainer">
            <div className="container">
                <div className="titles">
                    <p className="subTitle">Join the family today!</p>
                    <h1 className="mainTitle">Sign Up</h1>
                </div>
                <form id="signup" onSubmit={handle_submit}>
                    <h2>Please create your account below</h2>

                    <div className="input">
                        <label htmlFor="shelter_name">Shelter Name: </label>
                        <input type="text" id="shelter_name" name="shelter_name" required />
                        <p className="error">{errorJson.shelter_name}</p>

                    </div>

                    <div className="input">
                        <label htmlFor="username">Username: </label>
                        <input type="text" id="username" name="username" required />
                        <p className="error">{errorJson.username}</p>

                    </div>

                    <div className="input">
                        <label htmlFor="password">Password: </label>
                        <input type="password" id="password" name="password" required />
                        <p className="error">{errorJson.username}</p>

                    </div>

                    <div className="input">
                        <label htmlFor="email">Email: </label>
                        <input type="email" id="email" name="email" required />
                        <p className="error">{errorJson.email}</p>

                    </div>

                    <div className="input">
                        <label htmlFor="password1">Confirm Password: </label>
                        <input type="password" id="password1" name="password" required />

                    </div>

                    <div className="buttons">
                        <button className="btn" type="submit">Sign Up</button>
                        <a href="Index.html" className="btn" role="button">Cancel</a>
                    </div>
                    <p className="error">{error}</p>
                </form>
                <GoogleLogin />
                <div className="switchLink">
                    <p className="text">Already have an account?</p>
                    <a
                        style={{ color: '#0854a0', cursor: 'pointer' }}
                        className="linkSignUp"
                        onClick={() => navigate('/shelter/login/')}
                    >
                        Log In!
      </a>
                </div></div>
        </div>
    </main>;
}

export default ShelterSignUp;