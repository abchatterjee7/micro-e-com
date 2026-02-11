import { useEffect } from 'react';
import keycloak from '../keycloak';

const Signup = () => {
    useEffect(() => {
        keycloak.register();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Redirecting to register...</p>
        </div>
    );
};

export default Signup;
