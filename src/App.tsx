import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy load BranchFinder for better code splitting
const BranchFinder = lazy(() => import("./components/BranchFinder"));

// ============================================================================
// LOADING COMPONENT
// ============================================================================

const LoadingFallback = () => (
  <div className='flex items-center justify-center min-h-screen'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-midnight'></div>
  </div>
);

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  return (
    <div className='min-h-screen bg-warmWhite flex flex-col'>
      <Suspense fallback={<LoadingFallback />}>
        <Navbar />
        <BranchFinder />
        <Footer />
      </Suspense>
    </div>
  );
}
