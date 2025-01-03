import { Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-outfit font-bold">AimDash</h3>
            <p className="text-gray-400">Transform your goals into reality with powerful analytics and intuitive progress tracking.</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-outfit font-semibold">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Features</li>
              <li>Pricing</li>
              <li>FAQ</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-outfit font-semibold">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-outfit font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AimDash. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};