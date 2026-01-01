'use client';

import React from 'react';

interface MarkdownContentProps {
  content: string;
}

/**
 * MarkdownContent Component
 * 
 * Simple markdown renderer for blog posts
 * Converts markdown to HTML with proper styling
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  const htmlContent = React.useMemo(() => {
    let html = content;

    // Headings with IDs for ToC
    html = html.replace(/^### (.+)$/gm, (match, p1, offset) => {
      const index = content.substring(0, offset).split(/^#{2,3}/gm).length - 1;
      return `<h3 id="heading-${index}" class="text-2xl font-serif font-semibold text-gray-dark mt-8 mb-4">${p1}</h3>`;
    });
    
    html = html.replace(/^## (.+)$/gm, (match, p1, offset) => {
      const index = content.substring(0, offset).split(/^#{2,3}/gm).length - 1;
      return `<h2 id="heading-${index}" class="text-3xl font-serif font-bold text-gray-dark mt-10 mb-6">${p1}</h2>`;
    });

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-dark">$1</strong>');
    
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-anclora-gold hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-6 mb-2">$1</li>');
    html = html.replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc my-4 space-y-2 text-gray-700">$&</ul>');
    
    // Paragraphs
    html = html.replace(/^(?!<[hul]|<\/[hul])(.+)$/gm, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>');
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-anclora-gold pl-4 italic text-gray-600 my-6">$1</blockquote>');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre class="bg-gray-100 rounded-lg p-4 overflow-x-auto my-6"><code class="text-sm">$2</code></pre>');
    
    // Inline code
    html = html.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>');

    return html;
  }, [content]);

  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
