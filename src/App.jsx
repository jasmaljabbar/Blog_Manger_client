import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/UserAuth/Login';
import Register from './components/UserAuth/Register';
import BlogList from './components/Blog/BlogList';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './redux/actions/userActions';
import BlogForm from './components/Blog/BlogForm';
import { URL } from './services/api';
import BlogDetail from './components/Blog/BlogDetail';
import { userData } from './redux/actions/userActions';
import EditBlog from './components/Blog/EditBlog';

const ProtectedRoute = ({ element, isAuthenticated, redirectTo }) => {
  return isAuthenticated ? element : <Navigate to={Login}  />;
};

function App() {
  const [user, setUser] = useState(null);
  const { UserData } = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const storedTokens = localStorage.getItem('user');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await dispatch(userData());
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    const storedUser = localStorage.getItem('user');
    
    if (storedUser && !UserData) {  // Only fetch data if user is logged in and UserData is not already fetched
      const parsedUser = JSON.parse(storedUser);
      
      // You can add additional checks here like token expiration
      if (parsedUser.access) {
        fetchUserData();
      }
    }
  }, [dispatch, UserData]);
  
  

const updateToken = async () => {
  console.log('Update token called!');
  
  const storedTokens = localStorage.getItem('user');
  if (!storedTokens) {
      console.error('No tokens found in localStorage');
      await logout();  // Log out if token is missing
      return;
  }
  
  const authTokens = JSON.parse(storedTokens);

  if (!authTokens || !authTokens.refresh) {
      console.error('No refresh token available');
      await logout();  // Log out if refresh token is missing
      return;
  }

  const response = await fetch(`${URL}/token/refresh/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'refresh': authTokens.refresh })
  });

  const data = await response.json();

  if (response.status === 200) {
      console.log(data);
      localStorage.setItem('user', JSON.stringify(data)); 
  } else {
      // If the response contains an object with the 'detail' key
      if (data.detail) {
          console.error(`Failed to refresh token: ${data.detail}`);
      } else {
          console.error('Failed to refresh token');
      }
      await logout();  // Log out if token refresh fails
  }
};



// Effect to automatically refresh tokens periodically
useEffect(() => {
  let fourminutes = 1000 *60
  if (storedTokens) {
      try {
          const interval = setInterval(() => {
              updateToken();
          }, fourminutes);

          return () => clearInterval(interval);
      } catch (error) {
          console.error('Error in token refresh:', error);
      }
  }
}, [storedTokens]);






  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {      
      try {
        const decodedUser = jwtDecode(JSON.parse(storedUser).access);
        
        // Set user state based on decoded JWT
        setUser(decodedUser);

        // Dispatch login action
        dispatch(loginUser({ ...JSON.parse(storedUser) })); // Adjust based on your login action payload
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('user'); // Clear user from localStorage if there's an error
      }
    }
  }, [dispatch]);

  const isAuthenticated = !!user;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/blogForm" 
          element={<ProtectedRoute element={<BlogForm />} isAuthenticated={isAuthenticated} redirectTo="/login" />} 
        />
        <Route 
          path="/blog/:slug"
          element={<ProtectedRoute element={<BlogDetail />} isAuthenticated={isAuthenticated} redirectTo="/login" />} 
        />
        <Route 
          path="/edit_blog/:slug"
          element={<ProtectedRoute element={<EditBlog />} isAuthenticated={isAuthenticated} redirectTo="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
