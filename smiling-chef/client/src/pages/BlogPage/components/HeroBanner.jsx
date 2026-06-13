import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroBanner({ title = 'The Famous Halwai Blog', subtitle }) {
  return (
    <section className="w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="max-w-[1400px] mx-auto px-6 py-10 md:py-14 relative z-10">
        <nav className="text-sm text-gray-200 mb-2">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Blog</span>
        </nav>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">{title}</h1>
        {subtitle && <p className="mt-3 text-gray-200 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}
