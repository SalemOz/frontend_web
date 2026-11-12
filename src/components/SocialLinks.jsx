import Icon from './Icon.jsx';
import styles from './SocialLinks.module.css';

// Sustituir por los perfiles del negocio cuando estén disponibles.
// WhatsApp no va aquí: el Footer ya enlaza al chat del local (utils/whatsapp.js).
const socialLinks = [
  { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/' },
  { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/' },
];

export default function SocialLinks() {
  return (
    <nav className={styles.socialLinks} aria-label="Redes sociales">
      {socialLinks.map(({ name, icon, url }) => (
        <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${name} en una pestaña nueva`} title={name}>
          <Icon name={icon} ratio={1.1} />
        </a>
      ))}
    </nav>
  );
}
