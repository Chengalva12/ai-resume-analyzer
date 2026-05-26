import { useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeResume = async () => {
    if (!resume || !jobDescription) {
      alert("Please upload resume and enter job description");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_description", jobDescription);

      const response = await fetch(
        "https://ai-resume-analyzer-backend-7o6y.onrender.com/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Please try again after a few seconds.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>AI Resume Analyzer</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#analyzer">Analyzer</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <section className="hero" id="home">
        <h1>Boost Your Resume with AI</h1>
        <p>
          Upload your resume and get ATS score, missing skills, and improvement
          suggestions instantly.
        </p>
      </section>

      <main className="container" id="analyzer">
        <div className="card">
          <h2>Upload Resume</h2>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
          />

          <textarea
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <button onClick={analyzeResume} disabled={loading}>
            {loading ? "Analyzing..." : "🚀 Analyze Resume with AI"}
          </button>

          {error && <p className="error">{error}</p>}
        </div>

        {result && (
          <div className="result">
            <h2 className="score">ATS Score: {result.ats_score}%</h2>

            <div className="grid">
              <div className="result-card">
                <h3>Matched Skills</h3>
                <p>{result.matched_skills.join(", ") || "None"}</p>
              </div>

              <div className="result-card">
                <h3>Missing Skills</h3>
                <p>{result.missing_skills.join(", ") || "None"}</p>
              </div>
            </div>

            <div className="suggestion-card">
              <h3>AI Suggestions</h3>

              <ul>
                {result.suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      <section className="about" id="about">
        <h2>Why Use This Tool?</h2>
        <p>
          This AI Resume Analyzer helps job seekers compare their resume with a
          job description and improve keyword alignment for ATS systems.
        </p>
      </section>

      <footer>
        © 2026 AI Resume Analyzer • Created by Naga Sharanya Chengalva
      </footer>
    </div>
  );
}

export default App;