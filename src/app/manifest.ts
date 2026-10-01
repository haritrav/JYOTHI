import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JYOTHI - Digital Companion for Women',
    short_name: 'JYOTHI',
    description: 'Her Voice. Her Language. Her Access. AI Companion for Rural Women.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfbf7',
    theme_color: '#b11b65',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
