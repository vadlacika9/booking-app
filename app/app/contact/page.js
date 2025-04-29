// pages/contact.js
import Head from 'next/head';
import Link from 'next/link';


export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Contact Us | TechSwift</title>
        <meta name="description" content="Get in touch with TechSwift - your technology partner." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-12">Have questions or want to work with us? Get in touch using the information below.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contact Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Information</h2>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                <p className="text-gray-600">
                  123<br />
                  Cluj-Napoca, Aurel Vlaicu<br />
                  Romania
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                <a href="mailto:info@techswift.com" className="text-blue-600 hover:text-blue-800">info@wildpick.com</a>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                <a href="tel:+11234567890" className="text-blue-600 hover:text-blue-800">+1 (123) 456-7890</a>
              </div>
            </div>
            
            {/* Office Hours Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Office Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
            
            {/* Social Media Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Follow Us</h2>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="flex items-center text-gray-700 hover:text-blue-600">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </a>
                <a href="#" className="flex items-center text-gray-700 hover:text-blue-600">
                 
                  <svg className="w-6 h-6 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M10.053,7.988l5.631,8.024h-1.497L8.566,7.988H10.053z M21,7v10	c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V7c0-2.209,1.791-4,4-4h10C19.209,3,21,4.791,21,7z M17.538,17l-4.186-5.99L16.774,7	h-1.311l-2.704,3.16L10.552,7H6.702l3.941,5.633L6.906,17h1.333l3.001-3.516L13.698,17H17.538z"></path>
                  </svg>
                  X
                </a>
                <a href="#" className="flex items-center text-gray-700 hover:text-blue-600">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.1.048-1.44.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="mt-12 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Customer Support</h2>
              <p className="text-gray-600 mb-4">
                Need assistance? Our dedicated support team is available to help you with any questions or concerns.
              </p>
              <p className="mb-2">
                <span className="font-semibold">Support Email:</span>{" "}
                <a href="mailto:support@techswift.com" className="text-blue-600 hover:text-blue-800">support@wildpick.com</a>
              </p>
              <p>
                <span className="font-semibold">Support Hotline:</span>{" "}
                <a href="tel:+11234567899" className="text-blue-600 hover:text-blue-800">+1 (123) 456-7899</a>
              </p>
            </div>
            
        
          </div>
          
          {/* Call to Action */}
          <div className="mt-12 bg-indigo-600 rounded-lg shadow-md p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Contact us today to learn more about how we can help your business grow with our innovative technology solutions.
            </p>
            <div className="flex justify-center">
              <Link href="/about" className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-md hover:bg-gray-100 transition-colors">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}