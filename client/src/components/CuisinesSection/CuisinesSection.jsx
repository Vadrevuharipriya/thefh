import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cuisines } from '../../data/homeData';
import { slugify } from '../../utils/slugify';
import './CuisinesSection.scss';

function CuisineCard({ cuisine }) {
  return (
    <Link
      to={`/our-menu?cuisine=${slugify(cuisine.name)}`}
      className="cuisine-card"
    >
      <div className="cuisine-card__media">
        <img
          src={cuisine.image}
          alt={cuisine.name}
          className="cuisine-card__img"
          onError={(e) => {
            e.target.src = `https://picsum.photos/400/300?u=cuisine-${
              cuisine._id || cuisine.id || cuisine.name
            }`;
          }}
        />
        <div className="cuisine-card__overlay" />
        <div className="cuisine-card__hover-tint" />
      </div>
    </Link>
  );
}

export default function CuisinesSection() {
  return (
    <section className="cuisines-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="section-tag mx-auto">
            🍽️ Worldwide Cuisines
          </div>

          <h2 className="section-heading">
            15+ Menus &amp; <span className="text-brand-red">Cuisines</span>
          </h2>

          <p className="font-body text-gray-500 mt-4 text-base">
            From North Indian comfort food to exotic continental spreads
          </p>
        </div>

        <div className="cuisines-section__grid">
          {cuisines.map((cuisine) => (
            <div
              key={cuisine._id || cuisine.id || cuisine.name}
              className="cuisine-item"
            >
              <CuisineCard cuisine={cuisine} />
              <div className="cuisine-item__name">
                {cuisine.name}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/our-menu" className="btn-red">
            Explore Full Menu
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}