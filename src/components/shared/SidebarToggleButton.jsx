import { PanelLeftClose, PanelLeftOpen, Menu } from "lucide-react";

/**
 * Sits in a window's toolbar near the title/breadcrumb. On desktop/tablet it
 * collapses or expands the inline sidebar; on mobile there's nothing to
 * collapse (the sidebar isn't in the layout at all), so it opens the
 * slide-out drawer instead.
 */
export default function SidebarToggleButton({ collapsed, isMobile, onToggle, onOpenMobile, label = "sidebar" }) {
  if (isMobile) {
    return (
      <button type="button" className="toolbar__btn" onClick={onOpenMobile} aria-label={`Open ${label}`}>
        <Menu size={15} />
      </button>
    );
  }
  return (
    <button
      type="button"
      className="toolbar__btn"
      onClick={onToggle}
      aria-pressed={!collapsed}
      aria-label={collapsed ? `Show ${label}` : `Hide ${label}`}
      title={collapsed ? `Show ${label}` : `Hide ${label}`}
    >
      {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
    </button>
  );
}
