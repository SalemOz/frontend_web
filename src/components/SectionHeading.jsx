import styles from './SectionHeading.module.css';

export default function SectionHeading({ eyebrow, title, light = false }) {
  return (
    <div
      className={`${styles.sectionHeading} ${light ? styles.headingLight : ''}`}
    >
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
    </div>
  );
}
