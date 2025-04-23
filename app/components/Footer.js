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
              Providing quality services and connecting service providers with customers since 2023.
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
                  info@yourcompany.com
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
              <a href="https://twitter.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200" aria-label="Twitter">
                <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.018 10.018 0 01-3.127 1.191 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://instagram.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200" aria-label="Instagram">
                <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072C4.345.258 2.248 2.358 2.03 5.065c-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.218 2.707 2.318 4.807 5.025 5.025 1.283.058 1.691.072 4.95.072 3.259 0 3.668-.014 4.948-.072 2.706-.218 4.805-2.318 5.023-5.025.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.219-2.706-2.317-4.807-5.024-5.025-1.281-.058-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
          <p className="text-sm text-gray-400">&copy; {currentYear} Your Company. All rights reserved.</p>
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