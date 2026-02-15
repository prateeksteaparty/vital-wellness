'use client';

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { UserContext } from "../context/UserContext";
import { ThumbsUp, ThumbsDown, Zap, LogOut, ArrowLeft, Leaf, Star, Loader2, Heart, Package } from "lucide-react";

function Recommendations() {
  const { auth, setAuth, resetUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  const [saved, setSaved] = useState([]);
  const [submitted, setSubmitted] = useState({});
  const [loading, setLoading] = useState(true);

  // Load saved recommendations and feedback
  useEffect(() => {
    if (!auth?.id) return;

    const loadData = async () => {
      try {
        const [savedRes, feedbackRes] = await Promise.all([
          API.get(`/saved/${auth.id}`),
          API.get(`/feedback/${auth.id}`)
        ]);

        setSaved(savedRes.data);

        // Build submitted map from feedbacks
        const submittedMap = {};
        feedbackRes.data.forEach(f => {
          submittedMap[f.nutrientName] = f.worked;
        });

        setSubmitted(submittedMap);
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [auth?.id]);

  // Send feedback
  const sendFeedback = async (nutrientName, worked) => {
    if (!auth?.id) return;

    setSubmitted(prev => ({
      ...prev,
      [nutrientName]: worked
    }));

    try {
      await API.post("/feedback", {
        userId: auth.id,
        nutrientName,
        worked
      });
    } catch (err) {
      console.error("Feedback error:", err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    resetUserDetails();
    navigate("/signin");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
      </div>

      {/* HEADER */}
      <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/dashboard")}>
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <div>
              <strong className="text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">
                Vital
              </strong>
              <p className="text-xs text-slate-500 font-medium">Wellness Companion</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigate("/recommendations")}
              className="text-emerald-600 font-medium transition-colors duration-200 relative"
            >
              My Recommendations
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-600"></span>
            </button>
            <button onClick={() => navigate("/resources")} className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group">
              Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {/* TITLE SECTION */}
        <div className="mb-12">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 mb-6 font-medium transition-all hover:gap-3 group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl">
              <Heart className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">My Recommendations</h1>
              <p className="text-slate-600 mt-1">
                Track your saved wellness suggestions and share feedback
              </p>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {saved.length === 0 && (
          <div className="text-center py-20 animate-fadeIn">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No saved recommendations yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Go back to the dashboard and save nutrients that interest you to build your personalized wellness plan.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" /> Go to Dashboard
            </button>
          </div>
        )}

        {/* RECOMMENDATIONS GRID */}
        {saved.length > 0 && (
          <div className="animate-fadeIn">
            <div className="mb-8 flex items-center gap-3">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm">
                <span className="text-sm font-semibold text-slate-700">
                  {saved.length} saved recommendation{saved.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {saved.map((rec, index) => (
                <div 
                  key={rec._id} 
                  className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-7 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Header */}
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors duration-200">
                      {rec.nutrientName}
                    </h3>
                    <span className="inline-block px-2.5 py-1 text-xs uppercase font-bold text-emerald-700 bg-emerald-50 rounded-full tracking-wide">
                      Supplement
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {rec.description}
                  </p>

                  {/* Confidence Score if available */}
                  {rec.confidence && (
                    <div className="mb-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-slate-700">Confidence</span>
                        <span className="font-bold text-emerald-600">{rec.confidence}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-out rounded-full"
                          style={{ width: `${rec.confidence}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Food Sources */}
                  <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Food Sources</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{rec.food_sources}</p>
                  </div>

                  {/* Feedback Buttons */}
                  {submitted[rec.nutrientName] !== undefined ? (
                    <div className={`${
                      submitted[rec.nutrientName] 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-orange-50 border-orange-200'
                    } border rounded-xl p-4 text-center transition-all duration-300`}>
                      <p className={`text-sm font-semibold ${
                        submitted[rec.nutrientName] 
                          ? 'text-emerald-700' 
                          : 'text-orange-700'
                      }`}>
                        {submitted[rec.nutrientName] === true 
                          ? "✓ Thanks for your positive feedback!" 
                          : "✓ Feedback recorded, we'll improve"}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => sendFeedback(rec.nutrientName, true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <ThumbsUp className="w-4 h-4" /> Worked
                      </button>

                      <button
                        onClick={() => sendFeedback(rec.nutrientName, false)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <ThumbsDown className="w-4 h-4" /> Didn't work
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default Recommendations;