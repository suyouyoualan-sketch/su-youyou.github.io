const CONTENT_PATH = "./content/site.json";

const getValue = (object, path) =>
  path.split(".").reduce((value, key) => value?.[key], object);

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

const makeLink = (label, href, className) => {
  const link = document.createElement("a");
  link.textContent = label;
  link.href = href;
  if (className) link.className = className;
  if (/^https?:\/\//.test(href)) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  return link;
};

const hideSectionWhenEmpty = (id, values) => {
  const section = document.getElementById(id);
  const isEmpty = !values || values.length === 0;
  if (section) section.hidden = isEmpty;
  document.querySelectorAll(`[href="#${id}"]`).forEach((link) => {
    link.hidden = isEmpty;
  });
};

const setTextContent = (content) => {
  document.querySelectorAll("[data-text]").forEach((element) => {
    const value = getValue(content, element.dataset.text);
    element.textContent = hasText(value) ? value : "";
  });
};

const renderBio = (paragraphs = []) => {
  const bio = document.getElementById("bio");
  bio.replaceChildren();
  paragraphs.filter(hasText).forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    bio.append(paragraph);
  });
  hideSectionWhenEmpty("about", paragraphs.filter(hasText));
};

const renderInterests = (interests = []) => {
  const list = document.getElementById("research-interests");
  list.replaceChildren();
  interests.filter((item) => hasText(item?.name)).forEach((item) => {
    const entry = document.createElement("li");
    entry.textContent = item.name;
    list.append(entry);
  });
  hideSectionWhenEmpty("research", list.children);
};

const renderPortrait = (profile) => {
  const image = document.getElementById("portrait");
  const fallback = document.getElementById("portrait-fallback");
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  fallback.textContent = initials || "SY";
  if (!hasText(profile.portrait)) return;

  image.src = profile.portrait;
  image.alt = `${profile.name} portrait`;
  image.addEventListener("load", () => {
    image.style.display = "block";
    fallback.hidden = true;
    document.getElementById("portrait-wrap").removeAttribute("aria-hidden");
  });
};

const renderHeroActions = (profile) => {
  const actions = document.getElementById("hero-actions");
  actions.replaceChildren();
  if (hasText(profile.email)) {
    actions.append(makeLink("Email", `mailto:${profile.email}`));
  }
  if (hasText(profile.cv)) {
    actions.append(makeLink("Curriculum vitae", profile.cv));
  }
};

const renderPublications = (publications = [], allPublicationsUrl = "") => {
  const list = document.getElementById("publication-list");
  list.replaceChildren();

  publications.forEach((publication) => {
    if (!hasText(publication.title)) return;
    const item = document.createElement("li");
    const title = hasText(publication.url)
      ? makeLink(publication.title, publication.url, "item-title")
      : Object.assign(document.createElement("span"), {
          className: "item-title",
          textContent: publication.title,
        });
    item.append(title);

    const metadata = [publication.authors, publication.venue, publication.year]
      .filter(hasText)
      .join(" · ");
    if (metadata) {
      const meta = document.createElement("p");
      meta.className = "item-meta";
      meta.textContent = metadata;
      item.append(meta);
    }

    if (hasText(publication.summary)) {
      const summary = document.createElement("p");
      summary.className = "item-description";
      summary.textContent = publication.summary;
      item.append(summary);
    }

    if (hasText(publication.pdf)) {
      const links = document.createElement("div");
      links.className = "item-links";
      links.append(makeLink("PDF", publication.pdf));
      item.append(links);
    }
    list.append(item);
  });

  const allLink = document.getElementById("all-publications-link");
  if (hasText(allPublicationsUrl)) {
    allLink.href = allPublicationsUrl;
  } else {
    allLink.hidden = true;
  }
  hideSectionWhenEmpty("publications", list.children);
};

const renderProjects = (projects = []) => {
  const list = document.getElementById("project-list");
  list.replaceChildren();
  projects.forEach((project) => {
    if (!hasText(project.title)) return;
    const article = document.createElement("article");
    article.className = "project-card";
    const title = document.createElement("h3");
    title.append(
      hasText(project.url)
        ? makeLink(project.title, project.url)
        : document.createTextNode(project.title),
    );
    article.append(title);
    if (hasText(project.description)) {
      const description = document.createElement("p");
      description.className = "item-description";
      description.textContent = project.description;
      article.append(description);
    }
    list.append(article);
  });
  hideSectionWhenEmpty("projects", list.children);
};

const renderTimeline = (id, items = []) => {
  const list = document.getElementById(`${id}-list`);
  list.replaceChildren();
  items.forEach((item) => {
    if (!hasText(item.title)) return;
    const entry = document.createElement("article");
    entry.className = "timeline-item";
    const period = document.createElement("div");
    period.className = "timeline-period";
    period.textContent = item.period || "";
    const body = document.createElement("div");
    body.className = "timeline-body";
    const title = document.createElement("h3");
    title.textContent = item.title;
    body.append(title);
    [item.organization, item.description].filter(hasText).forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      body.append(paragraph);
    });
    entry.append(period, body);
    list.append(entry);
  });
  hideSectionWhenEmpty(id, list.children);
};

const renderContact = (profile) => {
  const details = [
    ["Email", profile.email, profile.email ? `mailto:${profile.email}` : ""],
    ["Affiliation", profile.affiliation, ""],
    ["Location", profile.location, ""],
  ].filter(([, value]) => hasText(value));

  const list = document.getElementById("contact-list");
  list.replaceChildren();
  details.forEach(([label, value, href]) => {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const definition = document.createElement("dd");
    definition.append(href ? makeLink(value, href) : document.createTextNode(value));
    wrapper.append(term, definition);
    list.append(wrapper);
  });
  document.getElementById("contact").hidden = details.length === 0;
};

const renderLinks = (links = []) => {
  const list = document.getElementById("profile-links");
  list.replaceChildren();
  links.forEach((link) => {
    if (!hasText(link.label) || !hasText(link.url)) return;
    const item = document.createElement("li");
    item.append(makeLink(link.label, link.url));
    list.append(item);
  });
  document.getElementById("links-section").hidden = list.children.length === 0;
};

const render = (content) => {
  document.documentElement.lang = content.site?.language || "en";
  document.title = content.site?.title || `${content.profile.name} · Researcher`;
  const description = document.querySelector('meta[name="description"]');
  if (hasText(content.site?.description)) description.content = content.site.description;

  setTextContent(content);
  renderPortrait(content.profile);
  renderHeroActions(content.profile);
  renderBio(content.about);
  renderInterests(content.researchInterests);
  renderPublications(content.publications, content.allPublicationsUrl);
  renderProjects(content.projects);
  renderTimeline("experience", content.experience);
  renderTimeline("education", content.education);
  renderContact(content.profile);
  renderLinks(content.links);
  document.getElementById("current-year").textContent = new Date().getFullYear();
};

fetch(CONTENT_PATH, { cache: "no-cache" })
  .then((response) => {
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    return response.json();
  })
  .then(render)
  .catch((error) => {
    console.error(error);
    const main = document.getElementById("main");
    const message = document.createElement("p");
    message.className = "load-error shell";
    message.textContent = "The site content could not be loaded. Please try again later.";
    main.prepend(message);
  });
