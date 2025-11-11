
import React, { useState, useCallback } from 'react';
import { generateLogoPrompt, generateLogoImage } from './services/geminiService';
import LogoDisplay from './components/LogoDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const ASPECT_RATIOS = ["1:1", "4:3", "3:4", "16:9", "9:16"];

const App: React.FC = () => {
  const [companyDescription, setCompanyDescription] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>(ASPECT_RATIOS[0]);
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLogo = useCallback(async () => {
    if (!companyDescription.trim()) {
      setError('Please provide a description for your company.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLogoImageUrl(null);

    try {
      const detailedPrompt = await generateLogoPrompt(companyDescription);
      const base64Image = await generateLogoImage(detailedPrompt, aspectRatio);
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      setLogoImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [companyDescription, aspectRatio]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Animated Logo Designer
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Turn your vision into a stunning, animated logo in seconds.
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                1. Describe your company & logo idea
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 placeholder-gray-500"
                placeholder="e.g., 'A coffee shop named Cosmic Brew, using a planet with a coffee ring like Saturn. Minimalist, modern, with a touch of blue.'"
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <h3 className="block text-sm font-medium text-gray-300 mb-2">2. Choose an aspect ratio</h3>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    disabled={isLoading}
                    className={`px-4 py-2 text-sm rounded-full transition-colors duration-300 ${
                      aspectRatio === ratio
                        ? 'bg-purple-600 text-white font-semibold shadow-lg'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateLogo}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Generating Magic...
                </>
              ) : (
                '✨ Generate Logo'
              )}
            </button>
          </div>
        </main>

        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
            <p><strong>Oops!</strong> {error}</p>
          </div>
        )}
        
        {logoImageUrl && !isLoading && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-4">Your Animated Logo!</h2>
            <LogoDisplay imageUrl={logoImageUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
