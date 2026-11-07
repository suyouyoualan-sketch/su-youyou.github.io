# Su Youyou — personal research website

A minimal, dependency-free researcher homepage for GitHub Pages.

## Edit content without Codex

1. Open [Pages CMS](https://app.pagescms.org/) and sign in with GitHub.
2. Select `suyouyoualan-sketch/su-youyou.github.io`.
3. Open **Website content** to edit the profile, biography, research interests, publications, projects, experience, education, and links.
4. Use the portrait, CV, and publication PDF fields to upload files. Uploads are stored in `assets/uploads`.
5. Save the change. Pages CMS commits it to GitHub, and GitHub Pages rebuilds the site automatically.

The media output uses a relative path so uploaded files work when this repository is published as a GitHub Pages project site under `/su-youyou.github.io/`.

The **Edit content** link in the website footer opens Pages CMS. GitHub permissions protect editing; visitors can see the link but cannot change the repository.

## Local preview

From the repository root, run:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then check `http://127.0.0.1:8000/`. Content lives in `content/site.json`; the page contains no build step or package dependencies.
