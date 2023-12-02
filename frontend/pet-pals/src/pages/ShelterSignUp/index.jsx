import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { LoginContext } from '../../contexts/LoginContext';



function ShelterSignUp() {
    const [error, setError] = useState("");
    const [errorJson, setErrorJson] = useState({});
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(LoginContext);

    function validateForm() {
        // Your validation logic here
        const shelterName = document.getElementById('shelter_name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        const password1 = document.getElementById('password1').value;

        // Example validation, you can customize based on your requirements
        if (!shelterName || !username || !password || !email || !password1) {
            setError("All fields must be filled out.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorJson({ 'email': "Enter a valid email address." });
            return false;
        }

        if (password.length < 8) {
            setErrorJson({ 'password': "This password is too short. It must contain at least 8 characters." });
            return false;
        }

        if (!/\d/.test(password)) {
            setErrorJson({ 'password': "Password must contain at least one digit." });

            return false;
        }


        if (password !== password1) {
            setErrorJson({ 'password1': "Passwords do not match." });
            return false;
        }

        // Additional validation checks if needed

        return true;
    }
    const handleButtonClick = () => {
        // Use the navigate function to redirect to '/'
        navigate('/');
    };

    function handle_submit(event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        console.log(event.target);
        let data = new FormData(event.target);
        console.log(data.get('username'));
        console.log(data.get('shelter_name'));
        console.log(data.get('password'));
        console.log(data.get('password1'));
        console.log(data.get('email'));

        ajax("/shelter/account/", {
            method: "POST",
            body: data,
        })
            .then(request => request.json())
            .then(json => {
                console.log(json);
                if ('access_token' in json) {
                    localStorage.setItem('access', json.access);
                    localStorage.setItem('username', data.get('username'));
                    setCurrentUser(json.shelter);
                    navigate('/');
                }
                else if ('errors' in json) {
                    setErrorJson(json.errors);
                }
                else {
                    setError("Unknown error while signing in.")
                }
            })
            .catch(error => {
                console.error(error);
                setError("Unknown error while signing in.");
            });



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
                        <p className="error">{errorJson.shelter_name || ""}</p>

                    </div>
                    <div className="input">
                        <label htmlFor="email">Email: </label>
                        <input type="email" id="email" name="email" required />
                        <p className="error">{errorJson.email || ""}</p>
                    </div>


                    <div className="input">
                        <label htmlFor="username">Username: </label>
                        <input type="text" id="username" name="username" required />
                        <p className="error">{errorJson.username || ""}</p>

                    </div>

                    <div className="input">
                        <label htmlFor="password">Password: </label>
                        <input type="password" id="password" name="password" required />
                        <p className="error">{errorJson.password || ""}</p>
                    </div>

                    <div className="input">
                        <label htmlFor="password1">Confirm Password: </label>
                        <input type="password" id="password1" name="password1" required />
                        <p className="error">{errorJson.password1 || ""}</p>

                    </div>

                    <div className="buttons">
                        <button className="btn" type="submit">Sign Up</button>
                        <button className="btn" onClick={handleButtonClick}>Cancel</button>
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
    </main >;
}

export default ShelterSignUp;