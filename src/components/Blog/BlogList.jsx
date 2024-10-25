import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { URL } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { logout, userData as fetchUserDataAction } from '../../redux/actions/userActions'; 

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        if (userData) {
            setUser(userData);
        }
    }, [userData]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${URL}/api/blogs/`);
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                await dispatch(fetchUserDataAction());
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchBlogs();
        fetchUserData();
    }, [dispatch]); // Changed dependency from user to dispatch

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-600">Welcome, {user.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <span className="text-gray-600">Loading user...</span>
                        )}
                        <Link
                            to="/blogForm/"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                        >
                            Create Post
                        </Link>
                    </div>
                </div>
            </header>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <div key={blog.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                            <Link to={`/blog/${blog.id}`} className="block">
                                <div className="relative pb-[60%]">
                                    {blog.image ? (
                                        <img 
                                            src={blog.image} 
                                            alt={blog.title}
                                            className="absolute h-full w-full object-cover"
                                        />
                                    ) : (
                                        <img 
                                            src="/api/placeholder/400/240"
                                            alt="Blog placeholder"
                                            className="absolute h-full w-full object-cover bg-gray-100"
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-600">
                                            By {blog.author_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;