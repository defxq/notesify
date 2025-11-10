import { useEffect, useRef, useState } from "react";
import { useLoginMutation } from "./authApiSlice";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import usePersists from "../../hooks/usePersists";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersists();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [triggerLogin, {
    isLoading,
  }] = useLoginMutation();

  const errClass = errMsg ? "errmsg" : "offscreen";


  const onUsernameChanged = (e) => setUsername(prev => e.target.value);
  const onPasswordChanged = (e) => setPassword(prev => e.target.value);
  const onPersistChanged = () => setPersist(prev => !prev);

  useEffect(() => {
    userRef.current.focus();
  }, []);
  
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await triggerLogin({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      toast.success("Logged in success!");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No server response");
      } else if (err.status === 400) {
        setErrMsg("Please fill out all fields");
      } else if (err.status === 401) {
        setErrMsg(prev => "Wrong username or password");
        console.log(errMsg);
      } else if (err.status === 429) {
        setErrMsg("Too many request please wait for 1 minute and try again")
      }

      console.log(err, errMsg);
      errRef.current.focus();
    };
  };

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg])

  const content = (
    <section>
      <header>
        Employee Login
      </header>
      <p
        ref={errRef}
        className={errClass}
      >
        {errMsg}
      </p>
      <main>
      <form onSubmit={handleLogin}>
            <h2>Login</h2>
                <label htmlFor="username">
                    Username:
                </label>
            <div>
                <input
                    type="text"
                    placeholder="username"
                    ref={userRef}
                    required
                    autoComplete="off"
                    id="username"
                    onChange={onUsernameChanged}
                    />
            </div>
                <label htmlFor="password">
                    Password:
                </label>
            <div>
                <input
                    type="password"
                    placeholder="password"
                    required
                    onChange={onPasswordChanged}
                    id="password"
                />
            </div>
            <button type="submit" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</button>
            <input type="checkbox" id="persist" onChange={onPersistChanged} checked={persist} />
            <label htmlFor="persist">Trust this device</label>
      </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );
  return content;
}
export default Login