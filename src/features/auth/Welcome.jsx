import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';

const Welcome = () => {
    const { roles, isAdmin, isManager } = useAuth();
    let date = new Date()
    const { username, status } = useAuth();
    let today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)
    const [time, setTime] = useState(today);
    // const date = new Date()
    // const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    
    useEffect(() => {
        const timing = setInterval(() => {
            date = new Date();
            today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)
            console.log("time-rendered");
            setTime(today);
        }, 1000);
        return () => {
            clearInterval(timing);
        };
    }, []);
    let content;
    if (!status) {
        content = <Link to="/login"><p>Please log in again</p></Link>
    }
    content = (
        <section className="welcome">

            <p>{time}</p>

            <h1>Welcome!</h1>

            <p><Link to="/dash/notes">View techNotes</Link></p>

            <p><Link to="/dash/notes/new">Add New techNote</Link></p>

            {(isAdmin || isManager) &&
                <>
                    <p><Link to="/dash/users">View User Settings</Link></p>
                    <p><Link to="/dash/users/new">Add New User</Link></p>
                </>}

        </section>
    )

    return content
}
export default Welcome