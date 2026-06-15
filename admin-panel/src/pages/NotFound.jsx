import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <div className="text-center">
        <div className="w-16 h-16 bg-brand-red rounded-3xl flex items-center justify-center mx-auto mb-6">
          <MdStorefront className="text-white" size={28} />
        </div>
        <h1 className="font-display font-extrabold text-gray-900 text-4xl mb-3">
          404
        </h1>
        <p className="text-gray-500 font-sans mb-8">Page not found</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 bg-brand-red text-white font-bold px-7 py-3.5 rounded-2xl text-sm hover:bg-brand-red-dark transition-colors font-sans"
        >
          <FiHome size={16} /> Back to Orders
        </Link>
      </div>
    </div>
  );
}
