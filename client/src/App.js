import './App.css';
import { useState } from 'react';
import Axios from 'axios';

function App() {
	const [emailReg, setEmailReg] = useState('');
	const [usernameReg, setUsernameReg] = useState('');
	const [passwordReg, setPasswordReg] = useState('');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [books, setBooks] = useState([]);

	// Axios.defaults.withCredentials = true;

	const register = async () => {
		await Axios.post('http://localhost:5000/user/register', {
			email: emailReg,
			username: usernameReg,
			password: passwordReg,
		}).then(res => {
			console.log(res);
		});
	};

	const login = async () => {
		await Axios.post('http://localhost:5000/user/login', {
			email: email,
			password: password,
		}).then(res => {
			const token = res?.data;
			console.log(token);
			sessionStorage.setItem('token', token);
		});
	};

	const logout = async () => {
		sessionStorage.removeItem('token');
	};

	const getBooks = async () => {
		let token = sessionStorage.getItem('token');

		// await Axios.get('http://localhost:5000/books?page=2&limit=2', {
		await Axios.get('http://localhost:5000/books', {
			headers: {
				'auth-token': token,
			},
		}).then(res => {
			setBooks(res.data);
			// console.log(books);
		});
	};

	return (
		<div className='App'>
			<div>
				<h1>Register</h1>
				<label>username</label>
				<input
					type='text'
					onChange={e => {
						setUsernameReg(e.target.value);
					}}
				/>
				<label>email</label>
				<input
					type='email'
					onChange={e => {
						setEmailReg(e.target.value);
					}}
				/>
				<label>password</label>
				<input
					type='password'
					onChange={e => {
						setPasswordReg(e.target.value);
					}}
				/>
				<button onClick={register}>Register</button>
			</div>
			<div>
				<h1>Login</h1>
				<label>email</label>
				<input
					type='email'
					onChange={e => {
						setEmail(e.target.value);
					}}
				/>
				<label>password</label>
				<input
					type='password'
					onChange={e => {
						setPassword(e.target.value);
					}}
				/>
				<button onClick={login}>Login</button>
			</div>
			<button onClick={getBooks}>Get Books</button>
			<button onClick={logout}>Logout</button>

			<pre>{JSON.stringify(books, null, 4)}</pre>
		</div>
	);
}

export default App;
