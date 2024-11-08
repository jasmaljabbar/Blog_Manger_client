import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/actions/userActions'; // Import your logout action

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user.userData); // Access user data from Redux

    const { isAuthenticated } = useSelector((state) => state.user);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap(); // Call the logout action to update the state
            navigate('/login'); // Navigate to the login page after logout
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/login');
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/">
                    <h1 className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition duration-300">Blog Posts</h1>
                </Link>

                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (  // Check if user exists directly from Redux state
                        <>
                           
                            <Link
                                to="/blogForm/"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                            >
                                Create Post
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/blogForm"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                            >
                                Create Post
                            </Link>
                            <Link
                                to="/login"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
