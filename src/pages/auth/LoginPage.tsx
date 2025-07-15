import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { login } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useToast } from "../../contexts/ToastContext";
import Loader from "../../components/Loader/Loader";
import { useDispatch } from "react-redux";
import logo from "../../assets/logo.png";

type FormData = {
    email: string;
    password: string;
};

const LoginPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { notify } = useToast();
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        // @ts-ignore
        let status = await login(data, notify, dispatch);

        // @ts-ignore
        if (status) {
            navigate("/admin");
        }
        setLoading(false);
    };
    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src={logo}
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    className="space-y-6"
                    action="#"
                    method="POST"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                type="text"
                                autoComplete="email"
                                {...register("email", {
                                    required: true,
                                    maxLength: 80,
                                })}
                                required
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        {errors.email?.type === "required" && (
                            <p className="text-red-600" role="alert">
                                email is required
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password
                            </label>
                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                {...register("password", {
                                    required: true,
                                    maxLength: 80,
                                })}
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.password?.type === "required" && (
                                <p className="text-red-600" role="alert">
                                    Password is required
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`${
                                loading ? "cursor-not-allowed" : ""
                            } flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                        >
                            {loading ? (
                                <Loader width={25} height={25} fill="#ff0000" />
                            ) : (
                                ""
                            )}
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{" "}
                    <a
                        href=""
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
