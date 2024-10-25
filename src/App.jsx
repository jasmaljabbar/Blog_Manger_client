import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/UserAuth/Login';
import Register from './components/UserAuth/Register';
import BlogList from './components/Blog/BlogList';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, userData as UserData } from './redux/actions/userActions';
import BlogForm from './components/Blog/BlogForm';
import { URL } from './services/api';
import BlogDetail from './components/Blog/BlogDetail';
import EditBlog from './components/Blog/EditBlog';

const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const storedTokens = localStorage.getItem('user');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await dispatch(UserData());
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (storedTokens) {
      const parsedUser = JSON.parse(storedTokens);
      if (parsedUser.access) {
        fetchUserData();
      }
    }
  }, [dispatch, storedTokens]);

  const updateToken = async () => {
    const storedTokens = localStorage.getItem('user');
    if (!storedTokens) {
      console.error('No tokens found in localStorage');
      return; // Consider adding a logout here
    }

    const authTokens = JSON.parse(storedTokens);
    if (!authTokens || !authTokens.refresh) {
      console.error('No refresh token available');
      return; // Consider adding a logout here
    }

    const response = await fetch(`${URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: authTokens.refresh }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
    } else {
      const data = await response.json();
      console.error(`Failed to refresh token: ${data.detail || 'Unknown error'}`);
      // Consider adding a logout here
    }
  };

  useEffect(() => {
    if (storedTokens) {
      const interval = setInterval(updateToken, 1000 * 60 * 6); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [storedTokens]);

  useEffect(() => {
    if (storedTokens) {
      try {
        const decodedUser = jwtDecode(JSON.parse(storedTokens).access);
        dispatch(loginUser({ ...JSON.parse(storedTokens) }));
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('user'); // Clear user from localStorage if there's an error
      }
    }
  }, [dispatch, storedTokens]);

  const isAuthenticated = userData; // Check if UserData exists for authentication

  

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
