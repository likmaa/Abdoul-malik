'use client';

import { useState } from 'react';

interface PreviewProps {
  type: 'partner' | 'testimonial' | 'hero' | 'immersive';
  data: any;
  onClose: () => void;
}

export function ContentPreview({ type, data, onClose }: PreviewProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Prévisualisation</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {type === 'partner' && (
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
              {data.logoPath && (
                <img
                  src={data.logoPath}
                  alt={data.alt || data.name}
                  className="max-h-16 w-auto object-contain"
                />
              )}
            </div>
          )}

          {type === 'testimonial' && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-violet-electric/10 rounded-full flex items-center justify-center">
                  <span className="text-violet-electric font-bold">
                    {data.initial}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{data.name}</h3>
                  <p className="text-sm text-gray-500">{data.product}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(data.rating || 5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic mb-2">
                &quot;{typeof data.text === 'string' ? data.text : (data.text?.fr || data.text)}&quot;
              </p>
              <p className="text-xs text-gray-500">{data.date}</p>
            </div>
          )}

          {type === 'hero' && (
            <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {data.mediaType === 'video' && data.videoUrl ? (
                <video
                  src={data.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={data.thumbnailUrl || data.imageUrl}
                />
              ) : data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Aucun média
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <h3 className="font-semibold text-lg">{data.name}</h3>
                {data.price && (
                  <p className="text-sm">{(data.price / 100).toFixed(2)} €</p>
                )}
              </div>
            </div>
          )}

          {type === 'immersive' && (
            <div className="relative w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden">
              {data.mediaType === 'video' && data.videoUrl ? (
                <video
                  src={data.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={data.thumbnailUrl || data.imageUrl}
                />
              ) : data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Aucun média
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <h3 className="font-semibold text-lg">{data.name}</h3>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note :</strong> Ceci est une prévisualisation. Le contenu peut apparaître différemment sur le site public selon le contexte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

