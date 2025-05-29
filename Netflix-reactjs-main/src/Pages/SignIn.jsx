import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Fade } from "react-reveal";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../Context/AuthContext";
import api from "../api";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setErrorMessage("");

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setErrorMessage("Email ou mot de passe incorrect");
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Erreur de connexion");
    } finally {
      setLoader(false);
    }
  };

  return (
    <section
      className="h-[100vh] bg-gray-50 dark:bg-gray-900"
      style={{
        background: `linear-gradient(0deg, hsl(0deg 0% 0% / 73%) 0%, hsl(0deg 0% 0% / 73%) 35%), url('/images/welcome-bg.jpg')`,
      }}
    >
      <div className="h-[100vh] flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-[#000000a2] rounded-lg shadow sm:my-0 md:mt-0 sm:max-w-lg xl:p-0 border-2 border-stone-800 lg:border-0">
          <Fade>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-12">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                Connexion à votre compte
              </h1>
              <h1 className="text-white text-2xl p-3 text-center border-2 border-red-700 rounded-sm">
                Streaming YouTube
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Votre email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={
                      errorMessage
                        ? "bg-stone-700 text-white sm:text-sm rounded-sm block w-full p-2.5 border-2 border-red-700 placeholder:text-white"
                        : "bg-stone-700 text-white sm:text-sm rounded-sm block w-full p-2.5 placeholder:text-white"
                    }
                    placeholder="nom@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={
                      errorMessage
                        ? "bg-stone-700 text-white sm:text-sm rounded-sm block w-full p-2.5 border-2 border-red-700 placeholder:text-white"
                        : "bg-stone-700 text-white sm:text-sm rounded-sm block w-full p-2.5 placeholder:text-white"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {errorMessage && (
                  <div className="flex text-white font-bold p-4 bg-red-700 rounded text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                    {errorMessage}
                  </div>
                )}
                <button
                  type="submit"
                  className={`w-full text-white ${
                    loader ? "bg-stone-700" : "bg-red-700 hover:bg-red-800"
                  } font-medium rounded-sm text-sm px-5 py-2.5 text-center transition ease-in-out`}
                  disabled={loader}
                >
                  {loader ? (
                    <ClipLoader color="#ff0000" size={20} />
                  ) : (
                    "Se connecter"
                  )}
                </button>
                <p className="text-sm font-light text-gray-400">
                  Pas encore de compte ?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-white hover:underline"
                  >
                    S’inscrire
                  </Link>
                </p>
              </form>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}

export default Login;
