const CONTENT_PATH = "./content/site.json";

const hasText = (value) => typeof value === "string" && value.trim() !== "";

const link = (label, href) => {
  const element = document.createElement("a");
  element.textContent = label;
  element.href = href;
  if (/^https?:\/\//.test(href)) {
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  }
  return element;
};

const paragraph = (text, className = "") => {
  const element = document.createElement("p");
  element.textContent = text;
  element.className = className;
  return element;
};

const emptyState = (message) => {
  const element = paragraph(message, "empty-state");
  return element;
};

const setCommonContent = (content) => {
  document.documentElement.lang = content.site?.language || "en";
  document.querySelectorAll("[data-profile-name]").forEach((element) => {
    element.textContent = content.profile.name;
  });
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
};

const renderHome = (content) => {
  document.title = content.site?.title || content.profile.name;
  const description = document.querySelector('meta[name="description"]');
  if (hasText(content.site?.description)) description.content = content.site.description;

  document.getElementById("profile-name-secondary").textContent = content.profile.nameZh || "";
  document.getElementById("profile-role").textContent = content.profile.role || "";
  document.getElementById("profile-affiliation").textContent = content.profile.affiliation || "";
  document.getElementById("profile-headline").textContent = content.profile.headline || "";

  if (hasText(content.profile.photo)) {
    const photo = document.getElementById("profile-photo");
    photo.src = content.profile.photo;
    photo.alt = `${content.profile.name} portrait`;
    photo.hidden = false;
    document.querySelector(".home-intro").classList.add("has-photo");
  }

  const about = document.getElementById("about-content");
  (content.about || []).filter(hasText).forEach((text) => about.append(paragraph(text)));
  if (!about.children.length) about.append(emptyState("Biography available soon."));

  const contact = document.getElementById("contact-details");
  const details = [
    ["Email", content.profile.email, content.profile.email ? `mailto:${content.profile.email}` : ""],
    ["Location", content.profile.location, ""],
  ].filter(([, value]) => hasText(value));
  details.forEach(([label, value, href]) => {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const definition = document.createElement("dd");
    term.textContent = label;
    definition.append(href ? link(value, href) : document.createTextNode(value));
    wrapper.append(term, definition);
    contact.append(wrapper);
  });

  const links = document.getElementById("profile-links");
  if (hasText(content.profile.cv)) {
    const item = document.createElement("li");
    item.append(link("Curriculum vitae", content.profile.cv));
    links.append(item);
  }
  (content.links || []).forEach((item) => {
    if (!hasText(item.label) || !hasText(item.url)) return;
    const listItem = document.createElement("li");
    listItem.append(link(item.label, item.url));
    links.append(listItem);
  });

  if (!details.length && !links.children.length) {
    document.getElementById("contact-section").hidden = true;
  }
};

const renderEducation = (content) => {
  const list = document.getElementById("education-list");
  const records = (content.education || []).filter((item) => hasText(item.title));
  if (!records.length) {
    list.append(emptyState("Education details will be added here."));
    return;
  }

  records.forEach((item) => {
    const article = document.createElement("article");
    article.className = "record";
    const period = document.createElement("div");
    period.className = "record-period";
    period.textContent = item.period || "";
    const body = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = item.title;
    body.append(title);
    if (hasText(item.organization)) body.append(paragraph(item.organization, "record-meta"));
    if (hasText(item.description)) body.append(paragraph(item.description, "record-description"));
    article.append(period, body);
    list.append(article);
  });
};

const renderProjects = (content) => {
  const list = document.getElementById("project-list");
  const records = (content.projects || []).filter((item) => hasText(item.title));
  if (!records.length) {
    list.append(emptyState("Project details will be added here."));
    return;
  }

  records.forEach((item) => {
    const article = document.createElement("article");
    article.className = "record";
    const period = document.createElement("div");
    period.className = "record-period";
    period.textContent = item.period || "";
    const body = document.createElement("div");
    const title = document.createElement("h2");
    title.append(hasText(item.url) ? link(item.title, item.url) : document.createTextNode(item.title));
    body.append(title);
    if (hasText(item.description)) body.append(paragraph(item.description, "record-description"));

    const links = document.createElement("div");
    links.className = "record-links";
    if (hasText(item.file)) links.append(link("Project file", item.file));
    if (links.children.length) body.append(links);

    if (hasText(item.image)) {
      const image = document.createElement("img");
      image.className = "project-image";
      image.src = item.image;
      image.alt = item.imageAlt || item.title;
      image.loading = "lazy";
      body.append(image);
    }
    article.append(period, body);
    list.append(article);
  });
};

const renderResearch = (content) => {
  const interests = document.getElementById("research-interests");
  (content.researchInterests || []).forEach((item) => {
    if (!hasText(item.name)) return;
    const listItem = document.createElement("li");
    listItem.textContent = item.name;
    interests.append(listItem);
  });
  if (!interests.children.length) interests.replaceWith(emptyState("Research interests will be added here."));

  const publications = document.getElementById("publication-list");
  (content.publications || []).forEach((item) => {
    if (!hasText(item.title)) return;
    const listItem = document.createElement("li");
    const title = document.createElement("div");
    title.className = "publication-title";
    title.append(hasText(item.url) ? link(item.title, item.url) : document.createTextNode(item.title));
    listItem.append(title);

    const metadata = [item.authors, item.venue, item.year].filter(hasText).join(" · ");
    if (metadata) listItem.append(paragraph(metadata, "publication-meta"));
    if (hasText(item.summary)) listItem.append(paragraph(item.summary, "publication-summary"));
    if (hasText(item.pdf)) {
      const links = document.createElement("div");
      links.className = "record-links";
      links.append(link("PDF", item.pdf));
      listItem.append(links);
    }
    publications.append(listItem);
  });
  if (!publications.children.length) publications.replaceWith(emptyState("Publications will be added here."));
};

const render = (content) => {
  setCommonContent(content);
  const page = document.body.dataset.page;
  if (page === "home") renderHome(content);
  if (page === "education") renderEducation(content);
  if (page === "projects") renderProjects(content);
  if (page === "research") renderResearch(content);
};

fetch(CONTENT_PATH, { cache: "no-cache" })
  .then((response) => {
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    return response.json();
  })
  .then(render)
  .catch((error) => {
    console.error(error);
    const message = paragraph("The site content could not be loaded.", "load-error");
    document.getElementById("content").prepend(message);
  });
