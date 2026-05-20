// import { useState } from "react";

// import {
//   useNavigate,
//   Link,
// } from "react-router-dom";

// import API from "../services/api";

// const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       const { data } = await API.post(
//         "/auth/login",
//         formData
//       );

//       localStorage.setItem(
//         "userInfo",
//         JSON.stringify(data)
//       );

//       navigate("/dashboard");
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         error.message ||
//         "Something went wrong";
//       alert(message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-900 to-black">
//       <form
//         onSubmit={submitHandler}
//         className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl w-[400px]"
//       >
//         <h1 className="text-4xl mb-6 font-bold text-center">
//           Welcome Back! Login
//         </h1>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-3 mb-4 rounded bg-black/20"
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               email: e.target.value,
//             })
//           }
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-3 mb-4 rounded bg-black/20"
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               password: e.target.value,
//             })
//           }
//         />

//         <button className="w-full bg-purple-600 p-3 rounded hover:bg-purple-700">
//           Login
//         </button>

//         <p className="mt-5 text-center">
//           Don't have an account?
//           <Link
//             to="/register"
//             className="text-purple-400 ml-2"
//           >
//             Register
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", formData);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Something went wrong";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="grid-overlay" />
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge">SYSTEM ACCESS</div>
          <h1 className="auth-title">TASKFLOW</h1>
          <p className="auth-sub">Enter credentials to continue</p>
        </div>

        <form onSubmit={submitHandler} className="auth-form">
          <div className="field-group">
            <label className="field-label">EMAIL_ADDRESS</label>
            <input
              type="email"
              placeholder="user@domain.com"
              className="cyber-input"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label className="field-label">PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••••"
              className="cyber-input"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="cyber-btn primary" disabled={loading}>
            {loading ? (
              <span className="btn-loading">AUTHENTICATING<span className="dots" /></span>
            ) : (
              "→ SIGN IN"
            )}
          </button>
        </form>

        <p className="auth-footer">
          No account?{" "}
          <Link to="/register" className="auth-link">
            REGISTER HERE
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;