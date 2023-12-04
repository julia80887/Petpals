import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { LoginContext } from '../../contexts/LoginContext';
//import 'bootstrap/dist/css/boostrap.min.css';
import { jwtDecode } from 'jwt-decode';

function ShelterLogin() {
    const [error, setError] = useState("");
    const [login, setLogin] = useState(false);
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(LoginContext);

    function handle_google(googleCred) {

        let data = new FormData();
        data.append('username', googleCred.email);
        data.append('password', googleCred.email);
        let photodata = new FormData();

        login_user(data);

    }


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
            login_user(data);

        }
        event.preventDefault();

    }

    function login_user(data) {
        ajax("/shelter/token/", {
            method: "POST",
            body: data,
        })
            .then(request => request.json())
            .then(json => {
                if ('access' in json) {
                    localStorage.setItem('access', json.access);
                    localStorage.setItem('username', json.shelter.user.username);
                    localStorage.setItem('custom_user', json.shelter.user.id.toString());
                    localStorage.setItem('shelter_name', json.shelter.shelter_name);
                    localStorage.setItem('id', json.shelter.id.toString());
                    localStorage.setItem('profile_photo', json.shelter.user.profile_photo.toString());
                    setCurrentUser(json.shelter);
                    console.log("reached");
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
                <GoogleLogin
                    buttonText="Log in with Google"
                    onSuccess={(credentialResponse) => {
                        const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                        //setGoogle(true);
                        //setGoogleCred(credentialResponseDecoded);
                        handle_google(credentialResponseDecoded);
                        console.log(credentialResponseDecoded);

                    }}

                    onError={() => {
                        console.log('Login Failed');
                    }}
                    isSignedIn={true}
                />
                <div className="switchLink">
                    <p className="text">Don't have an account yet?</p>
                    <Link className="linkSignUp" style={{ color: "#0854a0" }} to="/shelter/signup/">Sign up!</Link>
                </div></div>
        </div>
    </main>;

}

export default ShelterLogin;
