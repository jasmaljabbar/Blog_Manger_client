import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const BlogForm = () => {
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate()

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
            if (image) {
                formData.append('image', image);
            }

            try {
                await api.post(`api/blogs/`, formData);
                // Clear form on success
                resetForm();
                setImage(null);
                setError('');

                navigate('/')

            } catch (err) {
                setError('An error occurred while creating the blog');
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="max-w-2xl mx-auto p-4">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded"
                    required
                />
                {formik.touched.title && formik.errors.title ? (
                    <div className="text-red-500 mt-2">{formik.errors.title}</div>
                ) : null}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Content</label>
                <textarea
                    name="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded h-48"
                    required
                />
                {formik.touched.content && formik.errors.content ? (
                    <div className="text-red-500 mt-2">{formik.errors.content}</div>
                ) : null}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image</label>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                    className="w-full"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Create Blog
            </button>
        </form>
    );
};

export default BlogForm;
