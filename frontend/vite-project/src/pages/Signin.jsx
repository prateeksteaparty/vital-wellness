import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { Leaf, Mail, Lock, ArrowRight } from "lucide-react";

function Signin() {
  const { setAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/user/signin", { email, password });

      // ✅ store email & password for later /issues call
const authData = {
  id: res.data.user.id,   // ✅ FIXED
  name: res.data.user.name,
  gender: res.data.user.gender,
  dietPreference: res.data.user.dietPreference,
  lifestyle: res.data.user.lifestyle,
  allergies: res.data.user.allergies || [],
  email: res.data.user.email
};

setAuth(authData);
localStorage.setItem("auth", JSON.stringify(authData));
navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      signin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-emerald-600" strokeWidth={2} />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600">
              Sign in to continue to Vital
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-3">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-slate-50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-slate-50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              onClick={signin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-500 font-semibold">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/details"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Create a new account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-600 mt-6">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-emerald-600 hover:underline font-semibold">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-emerald-600 hover:underline font-semibold">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signin;