import './globals.css';
import { getSettings } from '../lib/data';
import Providers from '../components/Providers';
import Header from '../components/Header';
import Preloader from '../components/Preloader';
import Footer from '../components/Footer';

export const revalidate = 60;
export const metadata = {
  title: 'cookwithdavid',
  description: 'Fresh, hot food made to order. Order online for delivery or pickup.',
};

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Preloader brand={settings.brand} />
          <Header settings={settings} />
          <main>{children}</main>
          <Footer settings={settings} />
        </Providers>
      </body>
    </html>
  );
}
