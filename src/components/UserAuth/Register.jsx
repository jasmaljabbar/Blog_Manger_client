import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signUpUser } from '../../redux/actions/userActions'; 
import { useNavigate } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5"; // Adding home icon

const Register = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters long")
      .required("Username is required"),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleRegisterSubmit = (values) => {
    dispatch(signUpUser(values));
  };

  return (
    <>
      <a href="/" className="absolute top-4 left-4">
        <IoHomeOutline className="text-2xl text-indigo-600" />
      </a>
      <div className="min-h-screen bg-gradient-to-r from-blue-300 to-blue-500 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <Formik
            initialValues={initialValues}
            onSubmit={handleRegisterSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <Form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your username"
                  />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition duration-300 mt-6"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="login" className="text-indigo-600 hover:text-indigo-500 font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
