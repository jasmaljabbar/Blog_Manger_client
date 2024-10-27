import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import ImageUpload from '../../utils/cloudinary';

const BlogForm = () => {
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Formik form state and validation
    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .max(100, 'Title should not exceed 100 characters')
                .required('Title is required'),
            content: Yup.string()
                .min(50, 'Content must be at least 50 characters')
                .required('Content is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);

            try {
                // If image is provided, upload it to Cloudinary first
                if (image) {
                    const imageUrl = await ImageUpload(image);
                    formData.append('image', imageUrl);
                }

                await api.post(`api/blogs/`, formData);
                // Clear form on success
                resetForm();
                setImage(null);
                setError('');
                navigate('/');
            } catch (err) {
                if (err.response && err.response.data) {
                    const serverError = err.response.data.detail || 'Title already exists, please check it out';
                    setError(serverError);
                } else {
                    setError('An unexpected error occurred. Please try again.');
                }
            }
        },
    });

    return (
        <>
            <Navbar />

            <div className="max-w-4xl mx-auto py-10 px-5 md:px-8 lg:px-10">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Create a New Blog</h1>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded-lg px-8 py-8">
                    <div className="mb-6">
                        <label className="block text-lg text-gray-800 font-semibold mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full p-3 border ${formik.errors.title && formik.touched.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-blue-500`}
                            placeholder="Enter your blog title"
                        />
                        {formik.touched.title && formik.errors.title && (
                            <p className="text-red-500 text-sm mt-2">{formik.errors.title}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg text-gray-800 font-semibold mb-2">Content</label>
                        <textarea
                            name="content"
                            value={formik.values.content}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full p-3 border ${formik.errors.content && formik.touched.content ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-blue-500`}
                            placeholder="Write your blog content"
                            rows="6"
                        />
                        {formik.touched.content && formik.errors.content && (
                            <p className="text-red-500 text-sm mt-2">{formik.errors.content}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg text-gray-800 font-semibold mb-2">Upload Image</label>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                        >   
                            Submit Blog
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default BlogForm;
