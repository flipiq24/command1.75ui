import React from 'react';

export default function ActionPlan() {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-6">
        
        <div className="flex justify-between items-center mb-12">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Today's Action Plan</h2>
                <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Prioritized Workflow</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl px-6 py-3 border border-gray-100 flex flex-col items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Goal</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-blue-600">1</span>
                    <span className="text-xl font-bold text-gray-300">/ 3</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-4 items-end text-center h-48">
            
            <div className="relative z-10 transform scale-110 -mt-4 transition-all duration-300">
                <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-red-50">
                    <div className="relative w-28 h-28 mx-auto mb-3">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="56" cy="56" r="48" stroke="#fee2e2" strokeWidth="6" fill="transparent" />
                            <circle cx="56" cy="56" r="48" stroke="#ef4444" strokeWidth="6" fill="transparent" strokeDasharray="301" strokeDashoffset="200" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-gray-900">1</span>
                            <span className="text-[10px] font-bold text-red-500 uppercase">Pending</span>
                        </div>
                    </div>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-200 transition-all transform hover:-translate-y-1">
                        ▶ Start Here
                    </button>
                </div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-red-500 font-bold text-xs animate-bounce">
                    DO THIS FIRST ↓
                </div>
            </div>

            <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition">
                <div className="w-20 h-20 mb-4 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <button className="w-full border border-gray-200 bg-gray-50 text-green-600 text-xs font-bold py-2 px-4 rounded-lg cursor-default">
                    Review Complete
                </button>
            </div>

            <div className="flex flex-col items-center opacity-40 hover:opacity-100 transition scale-90">
                <div className="relative w-20 h-20 mb-4 grayscale">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="#f3f4f6" strokeWidth="4" fill="transparent" />
                        <circle cx="40" cy="40" r="36" stroke="#3b82f6" strokeWidth="4" fill="transparent" strokeDasharray="226" strokeDashoffset="226" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-400">0<span className="text-sm text-gray-300">/5</span></div>
                </div>
                <button className="w-full border border-gray-100 text-gray-400 bg-white text-xs font-bold py-2 px-4 rounded-lg cursor-not-allowed">
                    Open Cold Deals
                </button>
            </div>

            <div className="flex flex-col items-center opacity-40 hover:opacity-100 transition scale-90">
                <div className="relative w-20 h-20 mb-4 grayscale">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="#f3f4f6" strokeWidth="4" fill="transparent" />
                        <circle cx="40" cy="40" r="36" stroke="#22c55e" strokeWidth="4" fill="transparent" strokeDasharray="226" strokeDashoffset="15" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-400">56<span className="text-sm text-gray-300">/60</span></div>
                </div>
                <button className="w-full border border-gray-100 text-gray-400 bg-white text-xs font-bold py-2 px-4 rounded-lg cursor-not-allowed">
                    Process New Deals
                </button>
            </div>

        </div>
    </div>
  );
}