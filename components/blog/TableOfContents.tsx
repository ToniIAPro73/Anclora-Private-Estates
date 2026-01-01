'use client';

import React from 'react';
import { List } from 'lucide-react';

interface ToCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

/**
 * TableOfContents Component
 * 
 * Generates table of contents from markdown headings
 */
export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = React.useState<ToCItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>('');

  React.useEffect(() => {
    // Extract headings from markdown
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    
    const items = matches.map((match, index) => {
      const level = match[1].length;
      const title = match[2].trim();
      const id = `heading-${index}`;
      
      return { id, title, level };
    });

    setHeadings(items);

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    // Observe all headings
    setTimeout(() => {
      items.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    }, 100);

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="bg-beige rounded-lg p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-anclora-gold" />
        <h3 className="font-semibold text-gray-dark">Tabla de Contenidos</h3>
      </div>
      
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? 'ml-4' : ''}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 text-sm transition-colors ${
                activeId === heading.id
                  ? 'text-anclora-gold font-medium'
                  : 'text-gray-600 hover:text-anclora-gold'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
