import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/auth/register",
        formData
      );

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-black to-purple-900">
      <form
        onSubmit={submitHandler}
        className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl w-[400px]"
      >
        <h1 className="text-4xl mb-6 font-bold text-center">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 rounded bg-black/20"
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-black/20"
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-black/20"
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />

        <button className="w-full bg-purple-600 p-3 rounded hover:bg-purple-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;