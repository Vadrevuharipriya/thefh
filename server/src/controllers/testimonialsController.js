import Testimonial from '../models/Testimonial.js';

// ─── PUBLIC ──────────────────────────────────────────────────
export const getTestimonials = async (req, res) => {
  const data = await Testimonial.find().sort({ createdAt: -1 });
  res.json({
    reviews: data,
    totalReviews: data.length,
    rating: 4.9
  });
};
