import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {db} from '../firebase.config'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { Fragment } from 'react';
import OAuth from '../components/OAuth';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:''
    })


    const {name, email, password} = formData;

    const navigate = useNavigate();

    const onChangeHandler=(event)=>{
        
        setFormData((prevState)=>({
            
            ...prevState,
            [event.target.id]: event.target.value,
                      
        }));

    }
    async function signUpSubmitHandler(event){
        event.preventDefault();
        try {
            const auth = getAuth();

            const userCredential = await createUserWithEmailAndPassword(auth, 
                email, 
                password
                );

            const user = userCredential.user;
            updateProfile(auth.currentUser,{
                displayName: name,
            })

            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            console.log('Sign Up Successfully')
            navigate('/');

        } catch(error) {
            toast.error('Something went wrong with registration');
        }

    }
    // console.log(formData);
    return (
        <Fragment>
            <div className='pageContainer'>
                <header className='pageHeader'>
                    <p className='pageHeader'>Welcome Back</p>
                </header>
                <form onSubmit={signUpSubmitHandler}>
                <input type='name'
                            className='nameInput'
                            placeholder='Name'
                            id='name'
                            value={name}
                            onChange={onChangeHandler}>
                    </input>
                    <input type='email'
                            className='emailInput'
                            placeholder='Email'
                            id='email'
                            value={email}
                            onChange={onChangeHandler}>
                    </input>
                    <div className='passwordInputDiv'>
                        <input type={showPassword ? 'text':'password'}
                            className="passwordInput"
                            placeholder='Password'
                            id='password'
                            value={password}
                            onChange={onChangeHandler}
                        />
                        <img src={visibilityIcon} alt='show password'
                            className='showPassword'
                            onClick={()=> setShowPassword((prevState)=>!prevState)}
                        />
                    </div>
                     <Link to="/forgot-password" className='forgotPasswordLink'>
                        Forgot Password
                    </Link>
                    <div className='signUpBar'>
                        <p className='signUpText'>Sign Up</p>
                        <button className='signUpButton'>
                                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                        </button>
                    </div>
                </form>
                <OAuth />
                <Link to='/sign-in' className='registerLink'>
                    Sign In Instead
                </Link>
            </div>
        </Fragment>
    )
}
export default SignUp;