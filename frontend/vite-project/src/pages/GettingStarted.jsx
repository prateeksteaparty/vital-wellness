import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  Sparkles, 
  Brain, 
  Leaf, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const GettingStarted = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // clear old session
    localStorage.removeItem("token");
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced ML algorithms analyze your symptoms to provide personalized recommendations"
    },
    {
      icon: Zap,
      title: "Natural Solutions",
      description: "Discover nutrients and food sources backed by scientific research"
    },
    {
      icon: TrendingUp,
      title: "Confidence Scores",
      description: "See how well each recommendation matches your health profile"
    },
    {
      icon: Shield,
      title: "Science-Backed",
      description: "Every recommendation includes research citations and credible sources"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Sign In Button - Top Right */}
      <div className="relative z-10 flex justify-end px-6 py-4">
        <button
          onClick={() => navigate("/signin")}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
        >
          Sign In
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-3xl text-center space-y-8 mb-12">
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <Leaf className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent text-balance leading-tight">
              Welcome to Vital
            </h1>
            
            <p className="text-xl text-slate-600 text-balance max-w-2xl mx-auto leading-relaxed">
              Your personalized AI wellness companion that understands your unique health needs
            </p>
          </div>

          {/* CTA Button */}
          <button 
            onClick={() => navigate("/details")}
            className="group inline-flex items-center gap-2 h-14 px-8 text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all hover:scale-105"
          >
            <span>Get Started Now</span>
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
              <span className="text-sm font-medium text-slate-600">Science-Backed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
              <span className="text-sm font-medium text-slate-600">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
              <span className="text-sm font-medium text-slate-600">Personalized</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index} 
                className="group p-6 border border-slate-200 hover:border-emerald-300 transition-all hover:shadow-lg bg-white/80 backdrop-blur-sm rounded-xl"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-emerald-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="w-full max-w-2xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-700 mb-2">
            <span className="font-semibold text-emerald-700">Science-Backed Recommendations</span> with research citations
          </p>
          <p className="text-xs text-slate-600">
            Always consult healthcare professionals. Vital provides informational support only.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-slate-100 py-6 px-4">
        <div className="max-w-3xl mx-auto text-center text-xs text-slate-500">
          <p>Vital · AI-Powered Nutrition & Wellness Recommendations</p>
        </div>
      </footer>


    </div>
  );
};

export default GettingStarted;