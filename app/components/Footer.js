'use client';

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and brief description */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-4">
              <Image 
                src="/images/white_on_trans.png" 
                width={120} 
                height={40} 
                alt="Logo"
                className="h-12 w-auto filter drop-shadow-md"
              />
            </Link>
            <p className="text-gray-400 text-sm text-center md:text-left">
              Providing quality services and connecting service providers with customers since 2025.
            </p>
          </div>
          
          {/* Quick links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Quick Links</h3>
            <div className="flex flex-col space-y-2 items-center md:items-start">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                About Us
              </Link>
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors duration-200">
                Services
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                Contact
              </Link>
              <Link href="/add-service" className="text-gray-300 hover:text-white transition-colors duration-200">
                Add Your Service
              </Link>
            </div>
          </div>
          
          {/* Contact information */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">Contact Us</h3>
            <div className="flex flex-col space-y-2 items-center md:items-start">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@yourcompany.com" className="text-gray-300 hover:text-white transition-colors duration-200">
                  info@wildpick.com
                </a>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">(123) 456-7890</span>
              </div>
            </div>
            
            {/* Social media icons */}
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200" aria-label="Facebook">
                <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a>
              <a href="https://x.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200" aria-label="Twitter">
                
                <svg className="h-5 w-5 text-gray-300" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
                <path d="M10.053,7.988l5.631,8.024h-1.497L8.566,7.988H10.053z M21,21H3V3h18V21z M17.538,17l-4.186-5.99L16.774,7h-1.311l-2.704,3.16L10.552,7H6.702l3.941,5.633L6.906,17h1.333l3.001-3.516L13.698,17H17.538z"></path>
                </svg>
              </a>
              <a href="https://instagram.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200" aria-label="Instagram">
               
                <svg className="h-5 w-5 text-gray-300" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100"   height="100" viewBox="0 0 24 24">
                    <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200" aria-label="LinkedIn">
                <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom copyright bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; {currentYear} WildPick. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;