import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '../ui/Alert';
import ImageUpload from '../../utils/cloudinary';
import useAxiosInstance from '../../services/axiosInstance';

const EditBlog = ({ id, closeEdit }) => {  // Accept closeEdit as a prop
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const axiosInstance = useAxiosInstance()


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`/api/blogs/${id}/`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setCurrentImage(response.data.image);
        setIsLoading(false);
      } catch (error) {
        setError('Error fetching blog');
        setIsLoading(false);
        navigate('/login');
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      const imageUrl = await ImageUpload(image);
      
      formData.append('image', imageUrl);
    }

    try {
      await axiosInstance.put(`/api/blogs/${id}/`, formData);
      setSuccess('Blog updated successfully!');
      handleCancel();  // Close the edit form after success
    } catch (err) {
      // Error handling
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Please log in again to continue.');
            break;
          case 403:
            setError('You do not have permission to edit this blog.');
            break;
          case 413:
            setError('The image file is too large.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError('An error occurred while updating the blog post.');
        }
      } else {
        setError('Unable to connect to the server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    closeEdit(false);  // Call closeEdit to close the component
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Blog Post</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Image</label>
          {currentImage && (
            <div className="mb-2">
              <img
                src={currentImage}
                alt="Current blog"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to keep the current image
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-300"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
