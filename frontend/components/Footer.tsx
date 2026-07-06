'use client';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-500 mb-4">
          © {new Date().getFullYear()} Abdoul Malik AKOGO. Product Manager & Technology Strategist.
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://linkedin.com/in/abdoul-malik-akogo-023b8819b" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition">
            LinkedIn
          </a>
          <a href="mailto:abdoulmalik.akogo@gmail.com" className="text-gray-400 hover:text-black transition">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
