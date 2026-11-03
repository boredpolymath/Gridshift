# Security Policy

## Supported versions

Only the latest version on the repository's default branch is currently supported with security fixes.

## Reporting a vulnerability

Please do not report security vulnerabilities in public issues or pull requests. Use GitHub's private vulnerability reporting for this repository: open the **Security** tab, choose **Advisories**, then select **Report a vulnerability**.

If private vulnerability reporting is unavailable, contact the repository owner through GitHub at [@boredpolymath](https://github.com/boredpolymath) and request a private channel. Please include steps to reproduce, the affected file or workflow, and the potential impact. Avoid sharing real project data or other sensitive information.

The release owner will acknowledge reports as soon as practical, investigate them, and coordinate any fix and disclosure with the reporter. Please allow time for a fix before public disclosure.

## Local project data

Gridshift stores project records in the current browser profile and does not provide account-level access control or encryption. Other people with access to the same profile or device may view or change those records. Browser extensions granted access to the site can inspect or alter site content; use only trusted extensions in a profile that holds planning data. The JSON backup is readable and is not encrypted by Gridshift. Protect downloaded backups and delete them separately when no longer needed. Clearing Gridshift data in the browser does not remove backup files.

The planned GitHub Pages URL is `https://boredpolymath.github.io/Gridshift/`. Browser storage is scoped to the full origin, not the `/Gridshift/` path. Any other page published on `boredpolymath.github.io` can read, change, or delete Gridshift's localStorage data if opened in the same browser profile. This risk is separate from access by an unrelated website. Do not store confidential utility records on this shared origin unless all content publishers on it are trusted. A dedicated Gridshift hostname is required for origin isolation; disclosure alone does not prevent same-origin access.

## Deployment notes

The HTML includes a restrictive Content Security Policy. `style-src 'unsafe-inline'` remains because the current UI emits inline style attributes for charts and layout; script execution remains same-origin only. The selected host is GitHub Pages. Its repository workflow serves static files and has no per-response-header configuration, so this app cannot add `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, or a restrictive `Permissions-Policy` there. A meta CSP cannot enforce `frame-ancestors`. Inspect actual response headers after deployment and revisit hosting if the release owner requires these headers.
