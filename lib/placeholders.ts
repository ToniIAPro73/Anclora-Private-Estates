/**
 * PLACEHOLDER UTILITIES
 * Generate SVG placeholders for development
 */

export interface PlaceholderOptions {
  width: number;
  height: number;
  text?: string;
  bgColor?: string;
  textColor?: string;
}

/**
 * Generate SVG placeholder data URL
 * 
 * @example
 * <img src={generatePlaceholder({ width: 1200, height: 800, text: 'Villa' })} />
 */
export function generatePlaceholder({
  width,
  height,
  text = `${width}×${height}`,
  bgColor = '#F5F5DC',
  textColor = '#C5A059',
}: PlaceholderOptions): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Montserrat, sans-serif"
        font-size="${Math.max(width / 20, 16)}"
        font-weight="600"
        fill="${textColor}"
      >
        ${text}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Common placeholder sizes
 */
export const PLACEHOLDER_SIZES = {
  hero: { width: 1920, height: 1080 },
  propertyMain: { width: 1600, height: 1200 },
  propertyGallery: { width: 1200, height: 900 },
  propertyCard: { width: 800, height: 600 },
  blogFeatured: { width: 1200, height: 630 },
  blogCard: { width: 600, height: 400 },
  avatar: { width: 200, height: 200 },
  partnerLogo: { width: 200, height: 80 },
} as const;

/**
 * Get placeholder for common use cases
 */
export function getPlaceholder(
  type: keyof typeof PLACEHOLDER_SIZES,
  text?: string
): string {
  const dimensions = PLACEHOLDER_SIZES[type];
  return generatePlaceholder({ ...dimensions, text });
}
