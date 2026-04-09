import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BranchFinder from "./components/BranchFinder";

export default function App() {
  return (
    <div className='min-h-screen bg-cream flex flex-col'>
      <Navbar />
      <BranchFinder />
      <Footer />
    </div>
  );
}
