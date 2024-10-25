import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from '../../redux/actions/userActions';
import { Link, useNavigate } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";

const Login = () => {
    const { user, loading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch(); 
    const navigate = useNavigate();

    const initialValues = {
        email: "",
        password: ""
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email is not valid")
            .required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user]);

    const handleLoginSubmit = (values) => {
        dispatch(loginUser(values));
    };

    return (
        <>
            <Link to="/">
                <IoHomeOutline className="text-2xl absolute top-5 left-5 text-gray-600 hover:text-gray-800 transition duration-300" />
            </Link>
            <div className="min-h-screen bg-gradient-to-r from-blue-300 to-blue-500 flex items-center justify-center">
                <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg overflow-hidden">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleLoginSubmit}
                        validationSchema={validationSchema}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                        placeholder="Enter your email"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <Field
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                        placeholder="Enter your password"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                

                                <button
                                    type="submit"
                                    className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading || isSubmitting}
                                >
                                    {loading ? "Signing In..." : "Sign In"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-500 font-semibold">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
