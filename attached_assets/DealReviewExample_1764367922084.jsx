import React, { useState } from 'react';
import FlipIQCelebration from '@/components/FlipIQCelebration';
import Layout, { useLayout } from '@/components/Layout';

function DealReviewContent() {
  const [showCelebration, setShowCelebration] = useState(false);
  const { openIQWithSummary } = useLayout();
  
  // Handle celebration completion
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    
    // Open iQ overlay with summary
    openIQWithSummary({
      title: "Deal Review Complete!",
      summary: `
        All done with your active properties for today. This is what you did and why it matters:
        
        Summary:
        • 5 criticals completed ✓
        • 3 reminders logged ✓
        • 6 hot properties followed up ✓
        • AutoTrackers activated where needed and notes made
        
        Why it Matters:
        iQ's job is to keep you in front of each property and agent when it matters. 
        By communicating with efficiency and staying on top of it, this lets the agent 
        know you're consistent and professional. This will translate moving forward to 
        open escrow and all the way to closing.
        
        Are you ready to build relationships while finding deals?
      `,
      nextAction: "Start Daily Outreach"
    });
  };
  
  // Trigger celebration when all deals are complete
  const handleAllDealsComplete = () => {
    // Check if all circles are complete
    const hotComplete = true; // Replace with actual logic
    const warmComplete = true; // Replace with actual logic
    const coldComplete = true; // Replace with actual logic
    const newComplete = true; // Replace with actual logic
    
    if (hotComplete && warmComplete && coldComplete && newComplete) {
      setShowCelebration(true);
    }
  };
  
  return (
    <>
      {/* FlipIQ Celebration Modal */}
      <FlipIQCelebration 
        isOpen={showCelebration} 
        userName="Tony"
        onComplete={handleCelebrationComplete}
      />
      
      {/* Your Deal Review Page Content */}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Deal Review</h1>
        
        {/* Action Plan Circles */}
        <div className="flex gap-8 mb-8">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center">
              <span className="text-2xl font-bold">2/2</span>
            </div>
            <p className="mt-2">Hot Deals</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-500 flex items-center justify-center">
              <span className="text-2xl font-bold">1/1</span>
            </div>
            <p className="mt-2">Warm Deals</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center">
              <span className="text-2xl font-bold">1/1</span>
            </div>
            <p className="mt-2">Cold Deals</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-4 border-gray-400 flex items-center justify-center">
              <span className="text-2xl font-bold">3/3</span>
            </div>
            <p className="mt-2">New Deals</p>
          </div>
        </div>
        
        {/* Complete All Button - This triggers the celebration */}
        <button 
          onClick={handleAllDealsComplete}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold shadow-lg transition-colors"
        >
          Complete Deal Review
        </button>
        
        {/* Test Celebration Button (for development) */}
        <button 
          onClick={() => setShowCelebration(true)}
          className="ml-4 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold shadow-lg transition-colors"
        >
          Test Celebration 🎉
        </button>
      </div>
    </>
  );
}

// Export the page wrapped with Layout
export default function DealReviewPage() {
  return (
    <Layout>
      <DealReviewContent />
    </Layout>
  );
}
