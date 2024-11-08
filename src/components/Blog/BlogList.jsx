import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { URL } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar'; // Import the Navbar component

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(6); // Set number of blogs per page
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

       
       
        fetchBlogs();
    }, [dispatch]);


    // Get current blogs
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Use the Navbar component */}
            <Navbar />

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentBlogs.map(blog => (
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

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                    <nav aria-label="Pagination">
                        <ul className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index + 1}>
                                    <button
                                        onClick={() => paginate(index + 1)}
                                        className={`px-3 py-1 rounded-lg transition duration-300 ${
                                            currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-100'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default BlogList;
