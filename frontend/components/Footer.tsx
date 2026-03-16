import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-amazon-nav-dark text-white font-sans text-sm pb-8">
      {/* Back to top banner */}
      <a
        href="#"
        className="block bg-[#37475A] hover:bg-[#485769] text-center text-sm font-semibold py-4"
      >
        Back to top
      </a>

      {/* Main footer links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4 text-base">Get to Know Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="#" className="hover:underline">About Us</Link></li>
            <li><Link href="#" className="hover:underline">Careers</Link></li>
            <li><Link href="#" className="hover:underline">Press Releases</Link></li>
            <li><Link href="#" className="hover:underline">Amazon Science</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-base">Connect with Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="#" className="hover:underline">Facebook</Link></li>
            <li><Link href="#" className="hover:underline">Twitter</Link></li>
            <li><Link href="#" className="hover:underline">Instagram</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-base">Make Money with Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="#" className="hover:underline">Sell on Amazon</Link></li>
            <li><Link href="#" className="hover:underline">Sell under Amazon Accelerator</Link></li>
            <li><Link href="#" className="hover:underline">Protect and Build Your Brand</Link></li>
            <li><Link href="#" className="hover:underline">Amazon Global Selling</Link></li>
            <li><Link href="#" className="hover:underline">Become an Affiliate</Link></li>
            <li><Link href="#" className="hover:underline">Fulfilment by Amazon</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-base">Let Us Help You</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="#" className="hover:underline">COVID-19 and Amazon</Link></li>
            <li><Link href="#" className="hover:underline">Your Account</Link></li>
            <li><Link href="/orders" className="hover:underline">Returns Centre</Link></li>
            <li><Link href="#" className="hover:underline">100% Purchase Protection</Link></li>
            <li><Link href="#" className="hover:underline">Amazon App Download</Link></li>
            <li><Link href="#" className="hover:underline">Help</Link></li>
          </ul>
        </div>
      </div>

      <hr className="border-gray-600 mb-8 max-w-7xl mx-auto" />

      {/* Corporate Info */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400">
        <div>
          <Link href="/" className="hover:underline block text-white font-medium mb-1">AbeBooks</Link>
          <span>Books, art<br/>& collectibles</span>
        </div>
        <div>
          <Link href="/" className="hover:underline block text-white font-medium mb-1">Amazon Web Services</Link>
          <span>Scalable Cloud<br/>Computing Services</span>
        </div>
        <div>
          <Link href="/" className="hover:underline block text-white font-medium mb-1">Audible</Link>
          <span>Download<br/>Audio Books</span>
        </div>
        <div>
          <Link href="/" className="hover:underline block text-white font-medium mb-1">IMDb</Link>
          <span>Movies, TV<br/>& Celebrities</span>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-400 space-y-2">
        <div className="flex justify-center flex-wrap gap-4">
          <Link href="#" className="hover:underline">Conditions of Use & Sale</Link>
          <Link href="#" className="hover:underline">Privacy Notice</Link>
          <Link href="#" className="hover:underline">Interest-Based Ads</Link>
        </div>
        <p>© 1996-2026, Amazon Clone.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
}
