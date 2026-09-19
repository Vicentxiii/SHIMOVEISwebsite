import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const allItems: BreadcrumbItem[] = [{ name: 'Início', url: '/' }, ...items];

  // JSON-LD BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `https://www.silviahelena.com.br${item.url}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-[11px] tracking-widest uppercase font-light">
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1.5">
                {idx === 0 ? <Home size={11} className="text-brand-gold" aria-hidden="true" /> : <ChevronRight size={11} className="text-brand-muted" aria-hidden="true" />}
                {isLast ? (
                  <span className="text-brand-light font-medium" aria-current="page">{item.name}</span>
                ) : (
                  <Link to={item.url} className="text-brand-muted hover:text-brand-gold transition-colors underline-offset-4 hover:underline">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
