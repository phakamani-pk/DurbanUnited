import '@fontsource/archivo/400.css';
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import './globals.css';
import './admin.css';
import './navigation.css';
import './dashboard.css';
import './section-page.css';
import './club-brand.css';
import './commerce-auth.css';
import './squad.css';
import './profile-overlays.css';
import './match-centre.css';
import './header-brand.css';
import './hero-slider.css';
import './hero-slideshow.css';
import './club-assets.css';
import './home-hero-framing.css';

export const metadata = {
  title: 'Durban United | The heartbeat of the coast',
  description: 'Official home of Durban United Football Club.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
