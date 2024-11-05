import React, { useState } from 'react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Loader from "../loader/Loader"
import { useAppStore } from "../hooks/Context";


const Login = () => {
  const { setUserId, setEmail } = useAppStore();

  const [detail, setDetail] = useState({
    email: '',
    password: '',
  });
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const { email, password } = detail;
  const handleGoogleLogin = async () => {
    setLoader(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result)
      setUserId(result.user.uid);
      setEmail(result.user.email);
      if (result.user) {
        setDetail({
          email: "",
          password: "",
        });
        setLoader(false);
        navigate('/home');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error signing in with Google:', error.message);
    }
  };

  const handleLogin = async () => {
    setLoader(true);
    try {
      const t = await signInWithEmailAndPassword(auth, email, password);
      setUserId(t.user.uid);
      setEmail(t.user.email);

      if (t) {
        setDetail({
          email: "",
          password: "",
        });
        setLoader(false);
        navigate('/home');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error signing in:', error.message);
      if (error.code === 'auth/invalid-email') {
        alert('Invalid email format');
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password');
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (<div className="flex flex-col justify-center items-center bg-white h-[100vh]">
    {loader ?
      <Loader />
      : <div className="mx-auto flex w-full flex-col justify-center px-5 pt-0 md:h-[unset] md:max-w-[50%] lg:h-[100vh] min-h-[100vh] lg:max-w-[50%] lg:px-6">


        <div className="my-auto mb-auto mt-8 flex flex-col md:mt-[70px] w-[350px] max-w-[450px] mx-auto md:max-w-[450px] lg:mt-[130px] lg:max-w-[450px]">
          <p className="text-[32px] font-bold text-zinc-950 dark:text-white">
            Log in
            <span className='text-blue-700 cursor-pointer' onClick={() => { navigate(`/signup`); }}>
              /Sign up
            </span>
          </p>
          <p className="mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400">Enter your email and password</p>

          <div className="mt-8" onClick={handleGoogleLogin}>
            <form className="pb-2">
              <input type="hidden" name="provider" value="google" />
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 w-full text-zinc-950 py-6 dark:text-white"
                type="button"
              >
                <span className="mr-2">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    version="1.1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 48 48"
                    enableBackground="new 0 0 48 48"
                    className="h-5 w-5"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                </span>
                <span>Google</span>
              </button>
            </form>
          </div>

          <div className="relative my-4">
            <div className="relative flex items-center py-1">
              <div className="grow border-t border-zinc-200 dark:border-zinc-700"></div>
              <div className="grow border-t border-zinc-200 dark:border-zinc-700"></div>
            </div>
          </div>

          <div>
            <form noValidate className="mb-4">
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <label className="text-zinc-950 dark:text-white" htmlFor="email">Email</label>
                  <input
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400"
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    name="email"
                    value={detail.email}
                    onChange={(e) => setDetail({ ...detail, email: e.target.value })}
                  />
                  <label className="text-zinc-950 mt-2 dark:text-white" htmlFor="password">Password</label>
                  <input
                    id="password"
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400"
                    name="password"
                    value={detail.password}
                    onChange={(e) => setDetail({ ...detail, password: e.target.value })}
                  />
                </div>
                <button
                  className="whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium"
                  type="button"
                  onClick={handleLogin}
                >
                  Log in
                </button>

              </div>
            </form>
            <p className="font-medium text-zinc-950 dark:text-white text-sm">Forgot your password?</p>
            <p className="font-medium text-zinc-950 dark:text-white text-sm">Don't have an account? Sign up</p>
          </div>
        </div>
      </div>}
  </div>
  );
};

export default Login;