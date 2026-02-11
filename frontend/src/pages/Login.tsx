import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
    const { login, isAuthenticated, isAdmin } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated) {
            login();
        }
    }, [isAuthenticated, login]);

    if (isAuthenticated) {
        return <Navigate to={isAdmin ? "/admin" : "/"} />;
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
    );
};

export default Login;
