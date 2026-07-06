'use client';

import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { useTranslations } from 'next-intl';

export function NewsBar() {
  const t = useTranslations('NewsBar');
  const [text, setText] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function loadNewsBar() {
      try {
        const res = await fetch('/api/settings/newsbar');
        if (!res.ok) {
          if (isMounted) setText(t('defaultText'));
          return;
        }
        const data = await res.json();
        if (isMounted && typeof data.newsBarText === 'string' && data.newsBarText.trim().length > 0) {
          setText(data.newsBarText.trim());
        } else if (isMounted) {
          setText(t('defaultText'));
        }
      } catch {
        if (isMounted) setText(t('defaultText'));
      }
    }

    loadNewsBar();

    return () => {
      isMounted = false;
    };
  }, [t]);

  if (!text) return <div className="bg-black-deep h-10 w-full" />;

  return (
    <div className="bg-black-deep text-white py-2 overflow-hidden w-full">
      <Marquee speed={50} gradient={false} pauseOnHover={false} className="text-sm font-medium">
        <span className="mx-8 whitespace-nowrap">{text}</span>
        <span className="mx-8 whitespace-nowrap">{text}</span>
        <span className="mx-8 whitespace-nowrap">{text}</span>
      </Marquee>
    </div>
  );
}
