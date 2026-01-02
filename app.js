const toc = document.getElementById("toc");
const tocToggle = document.getElementById("tocToggle");
const tocOverlay = document.getElementById("tocOverlay");
const navLinks = document.querySelectorAll(".toc-links a");
const sections = document.querySelectorAll("[data-section]");
const groupButtons = document.querySelectorAll("[data-group-button]");
const tocGroups = document.querySelectorAll(".toc-group");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchCount = document.getElementById("searchCount");
const searchList = document.getElementById("searchList");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const normalizeText = (value) => value.replace(/\s+/g, " ").trim().toLowerCase();

const buildSearchIndex = () => {
  const sectionNodes = Array.from(document.querySelectorAll("main .section")).filter(
    (section) => section.id && section.id !== "search"
  );

  return sectionNodes.map((section) => {
    const titleEl = section.querySelector("h2");
    const summaryEl = section.querySelector("p");
    const title = titleEl ? titleEl.textContent.trim() : "제목 없음";
    const summary = summaryEl ? summaryEl.textContent.trim() : "";
    const text = normalizeText(section.textContent || "");
    return { id: section.id, title, summary, text };
  });
};

const searchIndex = buildSearchIndex();

const setActiveGroup = (group, options = {}) => {
  if (!groupButtons.length) return;
  const nextGroup = group || "all";

  groupButtons.forEach((button) => {
    const isActive = button.dataset.groupButton === nextGroup;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  sections.forEach((section) => {
    if (!section.classList.contains("section")) return;
    const sectionGroup = section.dataset.group;
    const isVisible =
      nextGroup === "all" || sectionGroup === nextGroup || sectionGroup === "global";
    section.classList.toggle("is-hidden", !isVisible);
  });

  tocGroups.forEach((groupEl) => {
    const groupKey = groupEl.dataset.group;
    const isVisible = nextGroup === "all" || groupKey === nextGroup;
    groupEl.classList.toggle("is-hidden", !isVisible);
    if (isVisible && nextGroup !== "all" && groupKey === nextGroup) {
      groupEl.open = true;
    }
  });

  navLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    const targetGroup = target?.dataset.group;
    const matchesGroup =
      nextGroup === "all" || targetGroup === nextGroup || targetGroup === "global";
    if (!matchesGroup) {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });

  if (options.save !== false) {
    localStorage.setItem("guideGroup", nextGroup);
  }
};

const setGroupFromSection = (sectionId) => {
  if (!sectionId) return;
  const target = document.querySelector(sectionId);
  if (!target) return;
  const section = target.closest("[data-section]") || target;
  const group = section.dataset.group;
  if (group && group !== "global") setActiveGroup(group);
};

const renderSearchResults = (items, term) => {
  if (!searchResults || !searchList || !searchCount) return;

  searchList.innerHTML = "";
  if (items.length === 0) {
    searchCount.textContent = `"${term}" 검색 결과가 없습니다.`;
    return;
  }

  searchCount.textContent = `${items.length}개의 결과가 있습니다.`;
  items.forEach((item) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${item.id}`;
    link.textContent = item.title;

    const snippet = document.createElement("p");
    const summaryText = item.summary || item.text;
    const shortText = summaryText.length > 140 ? `${summaryText.slice(0, 140)}...` : summaryText;
    snippet.textContent = shortText;

    li.appendChild(link);
    li.appendChild(snippet);
    searchList.appendChild(li);
  });
};

const setupCodeBlocks = () => {
  const codeBlocks = document.querySelectorAll(".code-block");
  codeBlocks.forEach((block) => {
    const code = block.querySelector("code");
    if (!code) return;

    let title = block.querySelector(".code-title");
    if (!title) {
      title = document.createElement("div");
      title.className = "code-title";
      title.textContent = "코드 예시";
      block.prepend(title);
    }

    if (title.querySelector(".code-actions")) return;

    const titleText = title.textContent.trim() || "코드 예시";
    const rawText = code.textContent.replace(/^\n+|\n+$/g, "");
    if (rawText) {
      const firstLine = rawText.split("\n")[0].trim();
      if (!firstLine.startsWith("//")) {
        code.textContent = `// ${titleText} 예시\n${rawText}`;
      }
    }
    title.textContent = "";
    const titleSpan = document.createElement("span");
    titleSpan.textContent = titleText;

    const actions = document.createElement("div");
    actions.className = "code-actions";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "code-action";
    copyButton.textContent = "복사";
    copyButton.setAttribute("aria-label", "코드 복사");

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "code-action";
    toggleButton.textContent = "접기";
    toggleButton.setAttribute("aria-label", "코드 접기");

    const setToggleState = (collapsed) => {
      toggleButton.textContent = collapsed ? "펼치기" : "접기";
      toggleButton.setAttribute("aria-label", collapsed ? "코드 펼치기" : "코드 접기");
      toggleButton.setAttribute("aria-expanded", collapsed ? "false" : "true");
    };

    const copyText = async () => {
      const text = code.innerText.trim();
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      copyButton.textContent = "복사됨";
      setTimeout(() => {
        copyButton.textContent = "복사";
      }, 1600);
    };

    copyButton.addEventListener("click", copyText);

    const toggleBlock = () => {
      block.classList.toggle("collapsed");
      setToggleState(block.classList.contains("collapsed"));
    };

    toggleButton.addEventListener("click", toggleBlock);

    const isLong = code.innerText.length > 600;
    if (isLong) {
      block.classList.add("collapsed");
      setToggleState(true);
    } else {
      setToggleState(false);
    }

    actions.appendChild(copyButton);
    actions.appendChild(toggleButton);
    title.appendChild(titleSpan);
    title.appendChild(actions);
  });
};

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    const term = event.target.value.trim();
    if (!searchResults || !searchCount) return;

    if (term.length < 2) {
      searchResults.classList.remove("active");
      searchCount.textContent = "2글자 이상 입력하면 검색이 시작됩니다.";
      if (searchList) searchList.innerHTML = "";
      return;
    }

    const normalizedTerm = term.toLowerCase();
    const matches = searchIndex.filter((item) => item.text.includes(normalizedTerm));
    searchResults.classList.add("active");
    renderSearchResults(matches, term);
  });
}

if (searchList) {
  searchList.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    setGroupFromSection(link.getAttribute("href"));
  });
}

groupButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveGroup(button.dataset.groupButton);
  });
});

const savedGroup = localStorage.getItem("guideGroup") || "all";
if (window.location.hash) {
  setGroupFromSection(window.location.hash);
} else {
  setActiveGroup(savedGroup, { save: false });
}

setupCodeBlocks();

const openToc = () => {
  if (!toc) return;
  toc.classList.add("open");
  if (tocOverlay) tocOverlay.classList.add("show");
  if (tocToggle) {
    tocToggle.setAttribute("aria-expanded", "true");
    tocToggle.textContent = "목차 닫기";
  }
};

const closeToc = () => {
  if (!toc) return;
  toc.classList.remove("open");
  if (tocOverlay) tocOverlay.classList.remove("show");
  if (tocToggle) {
    tocToggle.setAttribute("aria-expanded", "false");
    tocToggle.textContent = "목차 열기";
  }
};

if (tocToggle) {
  tocToggle.addEventListener("click", () => {
    if (toc.classList.contains("open")) {
      closeToc();
    } else {
      openToc();
    }
  });
}

if (tocOverlay) {
  tocOverlay.addEventListener("click", closeToc);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setGroupFromSection(link.getAttribute("href"));
    if (window.innerWidth <= 1100) {
      closeToc();
    }
  });
});

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.id;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
          const group = link.closest(".toc-group");
          if (group && !group.open) {
            group.open = true;
          }
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0.1 }
);

sections.forEach((section) => sectionObserver.observe(section));

const openGroupForHash = () => {
  const hash = window.location.hash;
  if (!hash) return;
  setGroupFromSection(hash);
  const link = document.querySelector(`.toc-links a[href="${hash}"]`);
  if (!link) return;
  const group = link.closest(".toc-group");
  if (group) group.open = true;
};

const openExampleFromHash = () => {
  const hash = window.location.hash;
  if (!hash || !hash.startsWith("#ex-")) return;
  const target = document.querySelector(hash);
  if (!target) return;
  const detail = target.tagName?.toLowerCase() === "details" ? target : target.closest("details");
  if (detail) detail.open = true;
  const group = target.closest(".example-group");
  if (group) group.open = true;
};

openGroupForHash();
openExampleFromHash();
window.addEventListener("hashchange", openGroupForHash);
window.addEventListener("hashchange", openExampleFromHash);
