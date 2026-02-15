'use client';

import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {
  Heart,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Zap,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Flame,
  Loader2,
  LogOut,
  Leaf
} from "lucide-react";

export default function Dashboard() {
  const { auth, setAuth, resetUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  const [issues, setIssues] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [savedMap, setSavedMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ✅ FIX 1: Move navigate check to useEffect
  useEffect(() => {
    if (!auth) {
      navigate("/signin");
    }
  }, [auth, navigate]);

  const quickSymptoms = [
    "Fatigue",
    "Stress",
    "Sleep issues",
    "Brain fog",
    "Recovery",
    "Energy boost"
  ];

  const getRecommendations = async () => {
    if (!issues.trim()) return;

    setIsLoading(true);
    try {
      const res = await API.post("/issues", {
        text: issues,
        userDetails: {
          userId: auth.id,  // ✅ FIX 2: Add userId here!
          gender: auth.gender,
          dietPreference: auth.dietPreference,
          lifestyle: auth.lifestyle,
          allergies: auth.allergies || []
        },
        feedbacks: []
      });

      setRecommendations(res.data.recommendations);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Recommendation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecommendation = async (rec) => {
    try {
      await API.post("/save", {
        userId: auth.id,
        nutrientName: rec.name,
        description: rec.description,
        food_sources: rec.food_sources,
        confidence: rec.confidence
      });

      setSavedMap(prev => ({ ...prev, [rec.name]: true }));
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const addQuickSymptom = (symptom) => {
    setIssues(prev =>
      prev.includes(symptom) ? prev : prev ? `${prev}, ${symptom}` : symptom
    );
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "from-emerald-500 to-teal-500";
    if (confidence >= 85) return "from-emerald-400 to-emerald-500";
    if (confidence >= 75) return "from-green-500 to-emerald-600";
    return "from-emerald-300 to-green-400";
  };

  // ✅ FIX 3: Show loading while checking auth
  if (!auth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
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
          <div className="flex items-center gap-3 cursor-pointer group">
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
              className="text-emerald-600 font-medium transition-colors duration-200 relative"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-600"></span>
            </button>
            <button 
              onClick={() => navigate("/recommendations")}
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group"
            >
              My Recommendations
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigate("/resources")}
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group"
            >
              Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          <button 
            onClick={() => {
              localStorage.removeItem("auth");
              setAuth(null);
              resetUserDetails();
              navigate("/signin");
            }} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">

        {/* DISCLAIMER */}
        <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-200/60 rounded-2xl p-5 mb-10 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow duration-300">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 leading-relaxed">
            This platform provides general wellness suggestions and does not offer medical advice. Always consult with healthcare professionals for medical concerns.
          </p>
        </div>

        {/* USER CARD */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 mb-10 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-white text-2xl font-bold">{auth.name.charAt(0).toUpperCase()}</span>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Welcome back</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{auth.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-medium text-sm border border-emerald-100">{auth.gender}</span>
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg font-medium text-sm border border-teal-100">{auth.dietPreference}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              {showProfile ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${showProfile ? 'max-h-40 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Lifestyle</span>
                <span className="text-sm font-medium text-slate-700">{auth.lifestyle}</span>
              </div>
              
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Allergies</span>
                <span className="text-sm font-medium text-slate-700">{auth.allergies?.join(", ") || "None"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all duration-300 mb-12">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">How are you feeling today?</label>
            <textarea
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              className="w-full min-h-36 border-2 border-slate-200 rounded-2xl p-6 text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 resize-none"
              placeholder="Describe your symptoms, concerns, or wellness goals..."
            />
          </div>

          <div className="mb-8">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Quick Select</p>
            <div className="flex gap-2 flex-wrap">
              {quickSymptoms.map(s => (
                <button 
                  key={s} 
                  onClick={() => addQuickSymptom(s)} 
                  className="px-4 py-2.5 border-2 border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 rounded-xl text-sm font-medium text-slate-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={getRecommendations}
            disabled={isLoading || !issues.trim()}
            className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing your wellness needs...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get Personalized Suggestions
              </>
            )}
          </button>
        </div>

        {/* RESULTS */}
        {recommendations.length > 0 && showSuggestions && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                <Flame className="text-emerald-600 w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">
                Your Wellness Support Suggestions
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, i) => (
                <div 
                  key={i} 
                  className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-7 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group animate-slideUp"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors duration-200">{rec.name}</h4>
                      <span className="inline-block px-2.5 py-1 text-xs uppercase font-bold text-emerald-700 bg-emerald-50 rounded-full tracking-wide">{rec.type}</span>
                    </div>
                    <button 
                      onClick={() => saveRecommendation(rec)}
                      className="p-2 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                    >
                      <Heart 
                        className={`w-6 h-6 transition-all duration-300 ${
                          savedMap[rec.name] 
                            ? "fill-red-500 text-red-500 scale-110" 
                            : "text-slate-300 hover:text-red-400"
                        }`} 
                      />
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-5">{rec.description}</p>

                  <div className="mb-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-700">Confidence</span>
                      <span className="font-bold text-emerald-600">{rec.confidence}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getConfidenceColor(rec.confidence)} transition-all duration-1000 ease-out rounded-full`}
                        style={{ width: `${rec.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl mb-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Food Sources</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{rec.food_sources}</p>
                  </div>

                  {rec.citation && (
                    <a 
                      href={rec.citation} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors duration-200 group/link"
                    >
                      View Research 
                      <ExternalLink className="w-4 h-4 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                    </a>
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