import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Leaf } from "lucide-react";

function Details() {
  const { setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    gender: "",
    dietPreference: "",
    lifestyle: "",
    allergies: []
  });

  const handleCheckboxChange = (value) => {
    setForm((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(value)
        ? prev.allergies.filter((a) => a !== value)
        : [...prev.allergies, value]
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.name || !form.gender) {
        alert("Please fill all required fields");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.dietPreference || !form.lifestyle) {
        alert("Please fill all required fields");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setUserDetails(form);
      navigate("/signup");
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate("/");
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-emerald-600" strokeWidth={2} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to Vital</h1>
          <p className="text-slate-600">Let us discover personalized nutrition recommendations for you</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`transition-all duration-300 ${
                dot === step
                  ? "w-8 h-2 bg-emerald-600 rounded-full"
                  : dot < step
                  ? "w-2 h-2 bg-emerald-600 rounded-full"
                  : "w-2 h-2 bg-slate-300 rounded-full"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Name & Gender */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            {/* Name Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-800">
                What should we call you?
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-slate-50"
              />
            </div>

            {/* Gender Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-800">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {["Male", "Female", "Other"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setForm({ ...form, gender: option.toLowerCase() })}
                    className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                      form.gender === option.toLowerCase()
                        ? "bg-emerald-50 border-emerald-600 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Diet & Lifestyle */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            {/* Diet Preference */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-800">
                Dietary Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "vegetarian", label: "Vegetarian", desc: "No meat or fish" },
                  { value: "vegan", label: "Vegan", desc: "No animal products" },
                  { value: "non-vegetarian", label: "Non-Vegetarian", desc: "Includes meat and fish" },
                  { value: "eggetarian", label: "Eggetarian", desc: "Vegetarian + eggs" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, dietPreference: option.value })}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${
                      form.dietPreference === option.value
                        ? "bg-emerald-50 border-emerald-600"
                        : "bg-white border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className={`font-semibold text-sm mb-1 ${
                      form.dietPreference === option.value ? "text-emerald-700" : "text-slate-800"
                    }`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-slate-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lifestyle */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-800">Lifestyle</label>
              <div className="space-y-2">
                {[
                  { value: "sedentary", label: "Sedentary", desc: "Desk job, minimal exercise" },
                  { value: "lightly_active", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
                  { value: "moderately_active", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
                  { value: "very_active", label: "Very Active", desc: "Intense exercise 6-7 days/week" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, lifestyle: option.value })}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      form.lifestyle === option.value
                        ? "bg-emerald-50 border-emerald-600"
                        : "bg-white border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className={`font-semibold text-sm mb-1 ${
                      form.lifestyle === option.value ? "text-emerald-700" : "text-slate-800"
                    }`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-slate-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Allergies & Summary */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            {/* Allergies */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-800">
                Do you have any allergies? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Nuts", "Dairy", "Gluten", "Shellfish", "Soy", "Eggs"].map((allergy) => (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => handleCheckboxChange(allergy.toLowerCase())}
                    className={`p-4 text-sm font-medium text-left rounded-lg border-2 transition-all ${
                      form.allergies.includes(allergy.toLowerCase())
                        ? "bg-emerald-50 border-emerald-600 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        form.allergies.includes(allergy.toLowerCase())
                          ? "bg-emerald-600 border-emerald-600"
                          : "bg-white border-slate-300"
                      }`}>
                        {form.allergies.includes(allergy.toLowerCase()) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {allergy}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500">Skip if you have no allergies</p>
            </div>

            {/* Profile Summary */}
            <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
              <h3 className="font-semibold text-slate-800 mb-4">Your Profile Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Name:</span>{" "}
                  <span className="font-semibold text-slate-800">{form.name || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-600">Gender:</span>{" "}
                  <span className="font-semibold text-slate-800 capitalize">{form.gender || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-600">Diet:</span>{" "}
                  <span className="font-semibold text-slate-800 capitalize">
                    {form.dietPreference?.replace("_", " ") || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Allergies:</span>{" "}
                  <span className="font-semibold text-slate-800 capitalize">
                    {form.allergies.length > 0 ? form.allergies.join(", ") : "None"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-600">Lifestyle:</span>{" "}
                  <span className="font-semibold text-slate-800 capitalize">
                    {form.lifestyle?.replace("_", " ") || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleBack}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && (!form.name || !form.gender)) ||
              (step === 2 && (!form.dietPreference || !form.lifestyle))
            }
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? "Get Started" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Details;