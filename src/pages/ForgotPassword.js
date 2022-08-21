import {useState} from 'react';
import {Link} from 'react-router-dom';
import {getAuth, sendPasswordResetEmail } from 'firebase/auth';
import {toast} from 'react-toastify';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';

function ForgotPassword() {
    const [email, setEmail] =useState('');

    function onChangeHandler (event){
        setEmail(event.target.value);

    }
    async function onSubmitHandler (event){
        event.preventDefault();
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            toast.success('Email was sent')
        } catch (error) {
            toast.error('Could not send reset email');
        }
    }
    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Forgot Password</p>
                <main>
                    <form onSubmit={onSubmitHandler} >
                        <input type='email'
                        className='emailInput'
                        placeholder='Email'
                        id='email'
                        value={email}
                        onChange={onChangeHandler}
                        />
                        <Link className='forgotPasswordLink' to='/sign-in'>
                            Sign In
                        </Link>
                        <div className='signInBar'>
                            <div className='signInText'>Send Reset Link</div>
                            <button className='signInButton'>
                                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                            </button>
                        </div>
                    </form>
                </main>
            </header>
        </div>
    )
}
export default ForgotPassword;