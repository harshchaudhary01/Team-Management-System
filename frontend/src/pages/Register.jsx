// import { useState } from "react";

// import { useNavigate } from "react-router-dom";

// import API from "../services/api";

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       await API.post(
//         "/auth/register",
//         formData
//       );

//       alert("Registration Successful");

//       navigate("/");
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         error.message ||
//         "Something went wrong";
//       alert(message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-black to-purple-900">
//       <form
//         onSubmit={submitHandler}
//         className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl w-[400px]"
//       >
//         <h1 className="text-4xl mb-6 font-bold text-center">
//           Register
//         </h1>

//         <input
//           type="text"
//           placeholder="Name"
//           className="w-full p-3 mb-4 rounded bg-black/20"
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               name: e.target.value,
//             })
//           }
//         />

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
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;




import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", formData);
      alert("Registration Successful");
      navigate("/");
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
          <div className="auth-badge">NEW ACCOUNT</div>
          <h1 className="auth-title">REGISTER</h1>
          <p className="auth-sub">Create your workspace identity</p>
        </div>

        <form onSubmit={submitHandler} className="auth-form">
          <div className="field-group">
            <label className="field-label">DISPLAY_NAME</label>
            <input
              type="text"
              placeholder="Your full name"
              className="cyber-input"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

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
              <span className="btn-loading">CREATING ACCOUNT<span className="dots" /></span>
            ) : (
              "→ CREATE ACCOUNT"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already registered?{" "}
          <Link to="/" className="auth-link">
            SIGN IN HERE
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;