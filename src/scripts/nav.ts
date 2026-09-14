/**
 * Header navigation behaviour, shared by all three mockups.
 *
 * The three directions style the header completely differently but behave the
 * same, so the behaviour is driven by data attributes rather than classes:
 *
 *   [data-nav]                    the <header>; data-nav-desktop="960" sets the
 *                                 width at or above which the desktop nav shows
 *   [data-nav-item]               a nav entry that may have a submenu
 *     [data-nav-toggle]             the link that opens it
 *     [data-nav-panel]              the submenu itself
 *   [data-menu-open] / [data-menu-close] / [data-menu]   the mobile overlay
 *
 * Everything degrades gracefully: with JS off, submenu panels stay closed and
 * every parent link is still a working in-page anchor.
 */
export function initNav(root: ParentNode = document): void {
  const header = root.querySelector<HTMLElement>('[data-nav]');
  if (!header) return;

  const desktopFrom = Number(header.dataset.navDesktop ?? '960');
  const desktop = window.matchMedia(`(min-width: ${desktopFrom}px)`);

  /* ---------- submenus ---------- */
  const items = Array.from(header.querySelectorAll<HTMLElement>('[data-nav-item]'));

  const setOpen = (item: HTMLElement, open: boolean) => {
    const panel = item.querySelector<HTMLElement>('[data-nav-panel]');
    const toggle = item.querySelector<HTMLElement>('[data-nav-toggle]');
    if (!panel) return;
    panel.hidden = !open;
    item.dataset.open = open ? 'true' : 'false';
    toggle?.setAttribute('aria-expanded', String(open));
  };

  const closeAll = (except?: HTMLElement) => {
    for (const item of items) if (item !== except) setOpen(item, false);
  };

  for (const item of items) {
    const panel = item.querySelector<HTMLElement>('[data-nav-panel]');
    const toggle = item.querySelector<HTMLElement>('[data-nav-toggle]');
    if (!panel || !toggle) continue;

    setOpen(item, false);
    toggle.setAttribute('aria-haspopup', 'true');

    // Desktop: hover to reveal, as in the mockups.
    item.addEventListener('mouseenter', () => {
      if (desktop.matches) { closeAll(item); setOpen(item, true); }
    });
    item.addEventListener('mouseleave', () => {
      if (desktop.matches) setOpen(item, false);
    });

    // Click toggles on both — the only way in on a touch screen, and it keeps
    // the parent link reachable by keyboard.
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const open = item.dataset.open !== 'true';
      closeAll(item);
      setOpen(item, open);
    });

    // Keyboard: arrow down opens, Escape closes and returns focus.
    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setOpen(item, true);
        panel.querySelector<HTMLElement>('a')?.focus();
      }
    });
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { setOpen(item, false); toggle.focus(); }
    });
  }

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target as Node)) closeAll();
  });

  /* ---------- mobile overlay ---------- */
  const menu = header.querySelector<HTMLElement>('[data-menu]');
  const openBtn = header.querySelector<HTMLElement>('[data-menu-open]');

  if (menu && openBtn) {
    menu.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');

    const setMenu = (open: boolean) => {
      menu.hidden = !open;
      openBtn.setAttribute('aria-expanded', String(open));
      // Stop the page behind the overlay from scrolling.
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) menu.querySelector<HTMLElement>('[data-menu-close]')?.focus();
      else { closeAll(); openBtn.focus(); }
    };

    openBtn.addEventListener('click', () => setMenu(true));
    menu.querySelectorAll<HTMLElement>('[data-menu-close]').forEach((btn) =>
      btn.addEventListener('click', () => setMenu(false))
    );
    // Any real link inside the overlay closes it; submenu toggles do not.
    menu.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
      if (link.hasAttribute('data-nav-toggle')) return;
      link.addEventListener('click', () => setMenu(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) setMenu(false);
    });
    // Rotating to a wide screen shouldn't leave the overlay stuck open.
    desktop.addEventListener('change', (event) => {
      if (event.matches && !menu.hidden) setMenu(false);
    });
  }
}
