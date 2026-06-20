import React from 'react';
import { Search } from 'lucide-react';

export default function SearchFilterBar({ filter, setFilter, search, setSearch, categories }) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center bg-white rounded-full shadow-sm px-3 py-2 w-full md:w-1/3">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            className="outline-none w-full text-sm text-gray-700"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1 rounded-full text-sm font-medium ${filter === cat ? 'bg-[#c91c24] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
