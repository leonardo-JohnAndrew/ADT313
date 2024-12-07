import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';
import { useUserContext } from '../../../context/UserContext';

function Login() {
  const { usertoken, setToken,login } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [role,setRole] = useState('user') // userstate(default:"user")
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    if (type === 'email') {
      setEmail(event.target.value);
    } else if (type === 'password') {
      setPassword(event.target.value);
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');
    try {
      const res = await axios.post(`/${role}/login`, data, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      // Store response access token to localStorage
      localStorage.setItem('accessToken', res.data.access_token);
      setToken(res.data.access_token);  // Update context state with token
      login(res.data.user);
    
       if(res.data.user.role ==="admin"){
        navigate('/main/admin/dashboard');
        setStatus('idle');
       }else{
          navigate('/');
       }
     
    } catch (e) {
      setError(e.response?.data?.message || 'An error occurred during login');
      setStatus('idle');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className='Login'>
      <div className='main-container'>
        <form>
          <div className='form-container'>
            <h3>Login</h3>
            {error && <span className='login errors'>{error}</span>}
            <div>
              <div className='form-group'>
                <label>E-mail:</label>
                <input
                  type='text'
                  name='email'
                  ref={emailRef}
                  onChange={(e) => handleOnChange(e, 'email')}
                />
              </div>
              {debounceState && isFieldsDirty && email === '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div>
              <div className='form-group'>
                <label>Password:</label>
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  name='password'
                  ref={passwordRef}
                  onChange={(e) => handleOnChange(e, 'password')}
                />
              </div>
              {debounceState && isFieldsDirty && password === '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div className='show-password' onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>
            <div className='role-container'>
              <label>
                <input
                  type='radio'
                  name='role'
                  value='user'
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                />
                User
              </label>
              <label>
                <input
                  type='radio'
                  name='role'
                  value='admin'
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                />
                Admin
              </label>
            </div>
             
            <div className='submit-container'>
              <button
                type='button'
                disabled={status === 'loading'}
                onClick={() => {
                  if (status === 'loading') return;
                  if (email && password) {
                    handleLogin();
                  } else {
                    setIsFieldsDirty(true);
                    if (email === '') {
                      emailRef.current.focus();
                    }
                    if (password === '') {
                      passwordRef.current.focus();
                    }
                  }
                }}
              >
                {status === 'idle' ? 'Login' : 'Loading...'}
              </button>
            </div>
            <div className='register-container'>
              <a href='/register'>
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
