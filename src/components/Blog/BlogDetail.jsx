import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/userActions';
import EditBlog from './EditBlog';

const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState('');
    const[edit,setEdit] = useState(false)
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()
  
    useEffect(() => {
      const fetchBlog = async () => {
        try {
          const response = await api.get(`/api/blogs/${slug}/`);
          setBlog(response.data);
        } catch (error) {
          setError('Error fetching blog');
          dispatch(logout())
          navigate('/login')
        }
      };
      fetchBlog();
      
    }, [slug,edit]);
  
    const handleDelete = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = storedUser ? JSON.parse(storedUser).access : null;

            if (!token) {
                alert('You need to be logged in to delete a blog post.');
                return;
            }
            if(window.confirm('Are you sure did you need to delete you post')){

                await api.delete(`api/blogs/${slug}/`);
                navigate('/')
            }

        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete the blog post.');
        }
    };
  
    if (!blog) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
  
    return (
      <div className="max-w-4xl mx-auto p-4">
        {!edit ?(
        <>
        
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        {blog.image && (
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="mb-4 max-w-full h-auto rounded"
          />
        )}
        <div className="text-gray-600 mb-4">
          By {blog.author_name} on {new Date(blog.created_at).toLocaleDateString()}
        </div>
        <div className="prose max-w-none mb-4">
          {blog.content}
        </div>
        {blog.is_author && (
          <div className="flex gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
            onClick={()=>{setEdit(!edit)}}
            >
                Edit
            </button>
            <button
             onClick={(e) => {
                e.preventDefault();
                handleDelete();
            }} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
        </>
        ):(
          <EditBlog id={slug} closeEdit={setEdit} />
        )}
        {/* {!edit ?(
           <EditBlog id={slug} closeEdit={setEdit} />  
        ):null} */}
      </div>
  )
}

export default BlogDetail
