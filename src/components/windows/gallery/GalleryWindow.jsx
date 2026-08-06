import { useState, useMemo } from "react";
import { Search, Minus, Plus, ImageOff } from "lucide-react";
import { galleryCategories, galleryItems } from "../../../data/gallery";
import { useSidebarCollapse } from "../../../hooks/useSidebarCollapse";
import SidebarDrawer from "../../shared/SidebarDrawer";
import SidebarToggleButton from "../../shared/SidebarToggleButton";
import Lightbox from "../../shared/Lightbox";
import EmptyState from "../../shared/EmptyState";
import "./gallery.css";

const SORTS = { newest: "Newest", name: "Name", category: "Category" };
const HEIGHT_VARIANTS = [180, 220, 150, 240, 190, 210, 165, 230];

export default function GalleryWindow() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [gridSize, setGridSize] = useState(3);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const sidebar = useSidebarCollapse("gallerySidebarCollapsed");

  const selectCategory = (id) => {
    setCategory(id);
    sidebar.closeMobile();
  };

  const categoryLinks = (
    <>
      {galleryCategories.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`side-link ${category === c.id ? "side-link--active" : ""}`}
          onClick={() => selectCategory(c.id)}
        >
          {c.label}
        </button>
      ))}
    </>
  );

  const filtered = useMemo(() => {
    let list = category === "all" ? [...galleryItems] : galleryItems.filter((g) => g.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((g) => g.title.toLowerCase().includes(q) || g.tool.toLowerCase().includes(q));
    }
    if (sortBy === "name") list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "category") list.sort((a, b) => a.category.localeCompare(b.category));
    else list.sort((a, b) => String(b.year).localeCompare(String(a.year)));
    return list;
  }, [category, search, sortBy]);

  const lightboxItems = filtered.map((g) => ({ src: g.image, title: g.title, caption: `${g.tool}${g.year ? " · " + g.year : ""}` }));

  return (
    <div className="win gallery-window">
      <div className={`split-view ${!sidebar.isMobile && sidebar.collapsed ? "split-view--collapsed" : ""}`}>
        {!sidebar.isMobile && (
          <>
            <div className="split-view__sidebar">{categoryLinks}</div>
            <div className="split-view__divider" onDoubleClick={sidebar.toggle} aria-hidden="true" />
          </>
        )}
        <div className="split-view__main">
          <div className="toolbar">
            <SidebarToggleButton
              collapsed={sidebar.collapsed}
              isMobile={sidebar.isMobile}
              onToggle={sidebar.toggle}
              onOpenMobile={sidebar.openMobile}
              label="category sidebar"
            />
            <div className="search-input">
              <Search size={13} />
              <input placeholder="Search gallery..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>Sort: {v}</option>)}
            </select>
            <div style={{ flex: 1 }} />
            <button type="button" className="toolbar__btn" onClick={() => setGridSize((s) => Math.max(2, s - 1))} aria-label="Smaller grid"><Minus size={13} /></button>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-secondary)" }}>Grid</span>
            <button type="button" className="toolbar__btn" onClick={() => setGridSize((s) => Math.min(5, s + 1))} aria-label="Larger grid"><Plus size={13} /></button>
          </div>

          <div className="gallery-window__scroll scrollable">
            {filtered.length === 0 ? (
              <EmptyState icon="search" title="No items found" text="Try a different search term or category." />
            ) : (
              <div className="gallery-masonry" style={{ columnCount: gridSize }}>
                {filtered.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    className="gallery-card"
                    style={{ "--gallery-h": `${HEIGHT_VARIANTS[i % HEIGHT_VARIANTS.length]}px` }}
                    onClick={() => setLightboxIndex(i)}
                  >
                    <span className="gallery-card__thumb">
                      {item.image ? (
                        <img src={item.image} alt={item.title} loading="lazy" />
                      ) : (
                        <ImageOff size={22} strokeWidth={1.3} />
                      )}
                    </span>
                    <span className="gallery-card__meta">
                      <span className="gallery-card__title">{item.title}</span>
                      <span className="gallery-card__sub">{item.category.replace(/-/g, " ")} · {item.tool}{item.year ? ` · ${item.year}` : ""}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {sidebar.isMobile && (
          <SidebarDrawer open={sidebar.mobileOpen} onClose={sidebar.closeMobile} label="Gallery categories">
            {categoryLinks}
          </SidebarDrawer>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox items={lightboxItems} index={lightboxIndex} onNavigate={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}
