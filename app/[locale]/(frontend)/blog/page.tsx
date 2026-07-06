'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Les Tendances Tech 2024 : Ce Qu\'il Faut Savoir',
      excerpt: 'Découvrez les dernières innovations technologiques qui vont marquer cette année, des smartphones aux objets connectés.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      date: '15 Novembre 2024',
      category: 'Tech',
      readTime: '5 min',
    },
    {
      id: 2,
      title: 'Guide Complet : Choisir le Bon Robot Tondeuse',
      excerpt: 'Tout ce que vous devez savoir pour choisir le robot tondeuse parfait pour votre jardin, avec nos recommandations d\'experts.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      date: '10 Novembre 2024',
      category: 'Jardin',
      readTime: '8 min',
    },
    {
      id: 3,
      title: 'Apple Vision Pro : Révolution ou Évolution ?',
      excerpt: 'Notre analyse approfondie du nouveau casque de réalité mixte d\'Apple et de son impact sur le marché.',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800',
      date: '5 Novembre 2024',
      category: 'Tech',
      readTime: '6 min',
    },
    {
      id: 4,
      title: 'L\'Arrosage Connecté : Simplifiez Votre Jardin',
      excerpt: 'Comment les systèmes d\'arrosage intelligents peuvent transformer votre façon de prendre soin de votre jardin.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      date: '1 Novembre 2024',
      category: 'Jardin',
      readTime: '4 min',
    },
  ];

  const categories = ['Tous', 'Tech', 'Jardin', 'Tutoriels', 'Actualités'];

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-electric to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              Blog eJS MARKET
            </h1>
            <p className="text-lg md:text-xl text-purple-100">
              Découvrez nos guides, actualités et conseils sur la technologie et le jardin connecté
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-violet-electric hover:text-white hover:border-violet-electric transition-colors font-medium text-sm"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  <Link href={`/blog/${post.id}`} className="block">
                    <div className="relative w-full h-48 md:h-56 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-violet-electric text-white text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime} de lecture</span>
                      </div>
                      <h3 className="text-xl font-bold text-black-deep mb-3 group-hover:text-violet-electric transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-violet-electric font-medium text-sm group-hover:underline">
                        Lire la suite
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-gradient-to-r from-violet-electric to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Restez informé de nos dernières actualités
            </h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Recevez nos articles directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg text-black-deep focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-violet-electric font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                S'abonner
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

