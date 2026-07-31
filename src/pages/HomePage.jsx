import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navbar */}
      <nav className="border-b border-border-light bg-surface-primary/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-primary text-surface-primary rounded-lg flex items-center justify-center font-bold text-sm">
              LS
            </div>
            <span className="font-semibold text-content-primary tracking-tight">LangSphere AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-content-secondary hover:text-content-primary transition-colors">
              Log in
            </Link>
            <button 
              onClick={() => navigate('/signup')}
              className="text-sm font-medium bg-accent-primary text-surface-primary px-4 py-2 rounded-md hover:bg-accent-secondary transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-content-primary mb-6 max-w-4xl mx-auto leading-tight">
          Master new languages with intelligent precision.
        </h1>
        <p className="text-lg sm:text-xl text-content-secondary mb-10 max-w-2xl mx-auto">
          LangSphere AI combines adaptive learning, computer vision, and generative AI to accelerate your path to fluency.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent-primary text-surface-primary px-6 py-3 rounded-md font-medium hover:bg-accent-secondary transition-all"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <a href="#features" className="w-full sm:w-auto flex items-center justify-center bg-surface-secondary text-content-primary px-6 py-3 rounded-md font-medium border border-border-strong hover:bg-bg-tertiary transition-all">
            Explore Features
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="bg-bg-secondary border-t border-border-light py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-primary p-8 rounded-xl border border-border-light shadow-sm">
              <div className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-content-primary" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary mb-2">AI-Powered Tutor</h3>
              <p className="text-sm text-content-secondary">
                Practice conversations with Gemini 2.5 Flash, receiving instant grammar and vocabulary feedback in real-time.
              </p>
            </div>
            <div className="bg-surface-primary p-8 rounded-xl border border-border-light shadow-sm">
              <div className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 text-content-primary" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary mb-2">Handwriting Practice</h3>
              <p className="text-sm text-content-secondary">
                Practice writing scripts on the canvas and receive precision stroke evaluations for any supported language.
              </p>
            </div>
            <div className="bg-surface-primary p-8 rounded-xl border border-border-light shadow-sm">
              <div className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-content-primary" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary mb-2">Adaptive Curriculum</h3>
              <p className="text-sm text-content-secondary">
                Learn English, Tamil, Hindi, or Telugu through structured lessons, rich stories, and progressive gamification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border-light bg-surface-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent-primary text-surface-primary rounded-md flex items-center justify-center font-bold text-xs">
              LS
            </div>
            <span className="text-sm font-medium text-content-primary">LangSphere AI</span>
          </div>
          <p className="text-sm text-content-tertiary">
            &copy; 2026 LangSphere AI. Developed at SIMATS Engineering.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
