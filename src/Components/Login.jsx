import React from 'react';
// import '../App.css';
import loginImg from '../Assets/login.png';
// import loginImg from '../Assets/login.png';

const Login = () => {
  return (
    <div className="card-login">
      <div className="form-login-left">
        <h1 className="title">
          WELCOME TO<br />Wyloz
        </h1>
      </div>
      <div className="form-login-right">
        <form className="input-login" id="loginForm">
          <img src={loginImg} alt="Login" className="img-form-login" />
          <strong>
            <p style={{ textAlign: 'center' }}>Sign In</p>
          </strong>
          <div className="form-group">
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Password"
            />
          </div>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" />
            <label className="form-check-label">Remember Me</label>
          </div>
          <button type="submit" id="btn-login-user" className="btn btn-warning">
            <i className="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp; Login
          </button>
          <strong>
            <p style={{ marginTop: '15px', marginBottom: '-15px' }}>
              Belum ada akun?&nbsp;
              <a href="#" style={{ width: '100%', color: 'blue', textDecoration: 'none' }}>
                Daftar
              </a>
            </p>
          </strong>
        </form>
      </div>
    </div>
  );
};

export default Login;
