import { getIcon } from "../../utils/iconMap";

export default function EmptyState({ icon = "image-off", title, text }) {
  const Icon = getIcon(icon);
  return (
    <div className="empty-state">
      <Icon size={30} strokeWidth={1.4} />
      {title && <p className="empty-state__title">{title}</p>}
      {text && <p className="empty-state__text">{text}</p>}
    </div>
  );
}
