import React from 'react';

const ProfessionalCoach: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Talk with a Professional Coach</h2>
          <p className="text-blue-100">Coming Soon: Get personalized financial advice from certified professionals</p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg">
          <span className="text-2xl">👨‍💼</span>
        </div>
      </div>
      <div className="mt-4">
        <button
          disabled
          className="px-4 py-2 bg-white/20 rounded-md text-sm font-medium hover:bg-white/30 transition-colors cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default ProfessionalCoach; 