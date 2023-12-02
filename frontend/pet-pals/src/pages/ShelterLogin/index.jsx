import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { LoginContext } from '../../contexts/LoginContext';
//import 'bootstrap/dist/css/boostrap.min.css';

function ShelterLogin() {
    const [error, setError] = useState("");
    const [login, setLogin] = useState(false);
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(LoginContext);


    function handle_submit(event) {

        let data = new FormData(event.target);

        data.set('username', event.target.username.value || '');
        data.set('password', event.target.password.value || '');
        console.log(data.get('username'));
        console.log(data.get('password'));

        if (data.get('username') === '') {
            setError('Username can not be blank.');
        }
        else if (data.get('password') === '') {
            setError('Password can not be blank.')
        }
        else {
            ajax("/shelter/token/", {
                method: "POST",
                body: data,
            })
                .then(request => request.json())
                .then(json => {
                    if ('access' in json) {
                        localStorage.setItem('access', json.access);
                        localStorage.setItem('username', data.get('username'));
                        setCurrentUser(json.shelter);
                        //console.log("reached");
                        //console.log(json.shelter);
                        //console.log(currentUser);
                        navigate('/');
                    }
                    else if ('detail' in json) {

                        setError(json.detail);
                        console.log(json.detail);
                    }
                    else {
                        setError("Unknown error while signing in.")
                    }
                })
                .catch(error => {
                    setError(error);
                });
        }
        event.preventDefault();

    }

    return <main>
        <div className="topnav">
            <Link to="/seeker/login/" >Pet Seekers</Link>
            <Link to="/shelter/login/" className="active">Pet Shelters</Link>
        </div>


        <div className="outerContainer">
            <div className="container">
                <div className="titles">
                    <p className="subTitle">Welcome Back Pet Shelter!</p>
                    <h1 className="mainTitle">Log In</h1>
                </div>
                <form id="login" onSubmit={handle_submit}>
                    <h2>Please enter your login information</h2>
                    <div className="input">
                        <label htmlFor="username">Username: </label>
                        <input type="text" id="username" name="username" required />
                    </div>

                    <div className="input">
                        <label htmlFor="password">Password: </label>
                        <input type="password" id="password" name="password" required />
                    </div>

                    <div className="buttons">
                        <button className="btn" type="submit">Login</button>
                        <a href="Index.html" className="btn" role="button">Cancel</a>
                    </div>
                    <p className="error">{error}</p>
                </form>
                <GoogleLogin />
                <div className="switchLink">
                    <p className="text">Don't have an account yet?</p>
                    <Link className="linkSignUp" style={{ color: "#0854a0" }} to="/shelter/signup/">Sign up!</Link>
                </div></div>
        </div>
    </main>;

}

export default ShelterLogin;
