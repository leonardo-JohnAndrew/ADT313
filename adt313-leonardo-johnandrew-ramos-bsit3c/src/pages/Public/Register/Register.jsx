
import { useState, useRef, useCallback, useEffect } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';
import { fireEvent } from '@testing-library/react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName,setFirst] = useState('');
  const [middleName,setMiddle] = useState('');
  const [lastName,setLast] = useState('');
  const [contactNo, setNo] = useState ('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstRef = useRef();
  const lastRef = useRef(); 
  const correctRef = useRef(); 
  const [role, setRole] = useState('user'); 
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({
     email,
      password,
      firstName,
     middleName,
     lastName,
     contactNo
    }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');

  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, [isShowPassword]);


  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
     case 'email':
        setEmail(event.target.value);
        break;

     case 'password':
        setPassword(event.target.value);
        break;
     case 'firstName':
         setFirst(event.target.value);
  
          break;
     case 'middleName':
         setMiddle(event.target.value);
         break;

     case 'lastName':
          setLast(event.target.value);
          break;

    case 'contactNo':
          setNo(event.target.value);
          break;
     
  
            default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { 
      email ,
      password,
      lastName,
      firstName,
       middleName,
       contactNo
       
     };
    setStatus('...');
    console.log(data);

    const url = role === 'admin' ? '/admin/register' : '/user/register';

    await axios({
      method: 'post',
      url,
      data,
      headers: {'Access-Control-Allow-Origin': '*'
       }
    
      
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.access_token);
        navigate('/login');
        setStatus('idle');
        alert('successfully created');
      })
      .catch((e) => {
        console.log(e);
        setStatus('idle');
        alert(e.response.data.message);
      });
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className='register'>
  
        <h3>Register</h3>
        <form>
          <div className='form'>  
             <label>Role:</label>
             <select
             name="role"
             value={role}
             onChange={(e) => setRole(e.target.value)}
             >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            </select>
               <label>Firstname:</label>
               <input
               type="text"
               name="firstName"
               ref={firstRef}
               onChange={(e)=>handleOnChange(e, 'firstName')}
               /> 
                 {debounceState && isFieldsDirty && firstName == '' && (
                 <span className='errors'>This field is required</span>)}
        
                 <label>Middlename:</label>
                 <input
                 type="text"
                 name="middleName"
                 onChange={(e)=>handleOnChange(e, 'middleName')}
                />

                 <label>Lastname:</label>
                 <input 
                 type="text" 
                 name="lastName"
                 ref={lastRef}
                 onChange={(e)=>handleOnChange(e,'lastName')}
                 />
                 {setDebounceState && isFieldsDirty && lastName == '' && (
                <span className='errors'>This field is required</span>)}
             

                <label>ContactNo:</label>
                <input type="text" 
                name="contactNo"         
                onChange={(e)=>handleOnChange(e,'contactNo')}
               />



                <label>E-mail:</label>
                <input
                  type='text'
                  name='email'
                  ref={emailRef}
                  onChange={(e) => handleOnChange(e, 'email')}
                />
                


              {debounceState && isFieldsDirty && email == '' && (
                <span className='errors'>This field is required</span>
              )}
      
         
                <label>Password:</label>
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  name='password'
                  ref={passwordRef}
                  onChange={(e) => handleOnChange(e, 'password')}
                />
              {debounceState && isFieldsDirty && password == '' && (
                <span className='errors'>This field is required</span>
              )}  
                <div className='show-password' onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

                 
              <div className='button'>
              <button
                type='button'
                disabled={status === '...'}
                onClick={() => {
                  if (status === '...') {
                    return;
                  }
                  if (email && password && lastName && firstName) {
                    handleLogin({
                      type: 'register',
                      user: { email, password ,firstName,lastName},
                    });
                  } else {
                    setIsFieldsDirty(true);
              
                    if (email == '') {
                      emailRef.current.focus();
                    }

                    if (password == '') {
                      passwordRef.current.focus();
                    }
                
                  }
                }}
              >
                {status === 'idle' ? 'Register' : '...'}
              </button>
     
            </div>
          <a href="/">
             <small>Exit</small>
          </a>
          </div>
        </form>
   </div>
  );
}

export default Register;