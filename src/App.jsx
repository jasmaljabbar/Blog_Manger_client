import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Login from './components/UserAuth/Login';
import Register from './components/UserAuth/Register';
import BlogList from './components/Blog/BlogList';
import BlogForm from './components/Blog/BlogForm';
import BlogDetail from './components/Blog/BlogDetail';
import EditBlog from './components/Blog/EditBlog';
import { token_valid } from './redux/actions/userActions';

// ProtectedRoute to restrict access to authenticated users
const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user); 
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if a token is stored in localStorage when the app loads
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated) {
      dispatch(token_valid());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/blogForm" 
          element={<ProtectedRoute element={<BlogForm />} isAuthenticated={isAuthenticated} />} 
        />
        <Route 
          path="/blog/:slug"
          element={<ProtectedRoute element={<BlogDetail />} isAuthenticated={isAuthenticated} />} 
        />
        <Route 
          path="/edit_blog/:slug"
          element={<ProtectedRoute element={<EditBlog />} isAuthenticated={isAuthenticated} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
