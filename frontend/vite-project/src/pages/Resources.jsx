'use client';

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { 
  Zap, 
  LogOut, 
  BookOpen, 
  Database, 
  Shield, 
  Search, 
  Award, 
  Leaf,
  ExternalLink,
  CheckCircle,
  Sparkles,
  Brain,
  Microscope,
  Globe,
  TrendingUp,
  Heart
} from "lucide-react";

function Resources() {
  const { auth, setAuth, resetUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    resetUserDetails();
    navigate("/signin");
  };

  const dataSources = [
    {
      name: "NIH - National Institutes of Health",
      icon: <Microscope className="w-6 h-6" />,
      description: "We leverage the comprehensive research database from the National Institutes of Health, ensuring our recommendations are backed by peer-reviewed studies.",
      url: "https://www.nih.gov/",
      color: "from-blue-100 to-blue-200",
      textColor: "text-blue-600"
    },
    {
      name: "MEDLINE Database",
      icon: <Database className="w-6 h-6" />,
      description: "Access to over 30 million citations from biomedical literature, helping us provide evidence-based wellness suggestions.",
      url: "https://www.nlm.nih.gov/medline/",
      color: "from-purple-100 to-purple-200",
      textColor: "text-purple-600"
    },
    {
      name: "PubMed Central",
      icon: <BookOpen className="w-6 h-6" />,
      description: "We analyze free full-text articles from biomedical and life sciences journals to ensure accuracy in our recommendations.",
      url: "https://www.ncbi.nlm.nih.gov/pmc/",
      color: "from-emerald-100 to-emerald-200",
      textColor: "text-emerald-600"
    },
    {
      name: "Clinical Research",
      icon: <Award className="w-6 h-6" />,
      description: "Our algorithms cross-reference clinical trial data to validate the effectiveness of nutritional interventions.",
      url: "https://clinicaltrials.gov/",
      color: "from-orange-100 to-orange-200",
      textColor: "text-orange-600"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your symptoms against thousands of research papers"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Evidence-Based",
      description: "Every recommendation is backed by peer-reviewed scientific research"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Personalized Results",
      description: "Tailored suggestions based on your diet, lifestyle, and health profile"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Constantly Updated",
      description: "Our database syncs with the latest nutritional and medical research"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "You Describe Symptoms",
      description: "Share your health concerns like 'I feel tired and dizzy' in natural language"
    },
    {
      step: "2",
      title: "Text Processing",
      description: "Your input is cleaned, normalized, and expanded with medical synonyms (tired → fatigue, exhaustion)"
    },
    {
      step: "3",
      title: "ML Pattern Matching",
      description: "TF-IDF vectorization and cosine similarity match your symptoms to our nutrient database"
    },
    {
      step: "4",
      title: "Smart Personalization",
      description: "Diet preferences and allergies filter results. Past feedback adjusts rankings automatically"
    },
    {
      step: "5",
      title: "Confidence Scoring",
      description: "Each match gets a normalized confidence score based on research strength and relevance"
    },
    {
      step: "6",
      title: "Top Results Delivered",
      description: "Receive your top 5 personalized nutrient recommendations with explanations and food sources"
    }
  ];

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
              className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group"
            >
              My Recommendations
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigate("/resources")}
              className="text-emerald-600 font-medium transition-colors duration-200 relative"
            >
              Resources
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-600"></span>
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

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">About Vital</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Science-Backed Wellness
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Vital combines cutting-edge AI technology with trusted medical databases to provide you with personalized, evidence-based wellness recommendations.
          </p>
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How Vital Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((item, index) => (
              <div 
                key={index}
                className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DATA SOURCES */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Research Sources</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We partner with the world's most trusted medical and scientific databases
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {dataSources.map((source, index) => (
              <div 
                key={index}
                className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${source.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <div className={source.textColor}>
                      {source.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {source.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {source.description}
                </p>
                <a 
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors group/link"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Why Trust Vital?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-emerald-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-8 mb-16">
          <div className="flex gap-4 items-start">
            <Shield className="w-8 h-8 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">Important Disclaimer</h3>
              <div className="space-y-2 text-sm text-amber-900 leading-relaxed">
                <p>
                  <strong>Vital is not a substitute for professional medical advice.</strong> Our recommendations are based on scientific research and are intended for informational purposes only.
                </p>
                <p>
                  Always consult with qualified healthcare professionals before making any changes to your diet, lifestyle, or health regimen. If you have a medical condition or are taking medications, please seek professional medical guidance.
                </p>
                <p>
                  The information provided by Vital should not be used to diagnose, treat, cure, or prevent any disease or health condition.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WHY VITAL IS DIFFERENT */}
        <div className="bg-gradient-to-br from-white to-emerald-50/30 border border-slate-200/60 rounded-3xl p-10 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">What Makes Vital Different</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Understands You Like a Doctor</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Just type how you feel in plain language - "tired and dizzy" or "trouble sleeping". Our AI expands your words with medical terms to find the best matches.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Smart Personalization</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Vegan? Allergic to shellfish? We automatically filter out anything that doesn't work for your lifestyle and keeps you safe.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Gets Smarter With You</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Mark what worked and what didn't. Vital learns from your feedback and improves future recommendations just for you.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Research-Backed Confidence</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Every recommendation comes with a confidence score showing how strong the scientific evidence is. No guesswork.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Millions of Research Papers</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We analyze data from NIH, MEDLINE, and clinical trials to find nutrients proven to help with your specific symptoms.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Real Food Sources</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Get practical food suggestions you can find at any grocery store. No need to buy expensive supplements right away.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Resources;