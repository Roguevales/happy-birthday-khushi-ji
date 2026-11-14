# Changes in this revision

- Made the birthday date and IANA timezone explicit configuration values.
- Corrected the countdown to use midnight in the configured timezone and added before/on/after birthday states.
- Added a visible, screen-reader-announced audio player status and improved playback error handling.
- Improved countdown announcements, the hero illustration role, and interactive control feedback.
- Removed the redundant section-caption stylesheet and kept shared caption styling in `bouquet.css`.
- Converted the displayed bouquet image to WebP and enabled lazy loading.
- Added basic security headers to both the local development server and Vercel configuration.
- Hardened local path decoding and symlink checks; added WebP MIME support.
- Expanded README instructions for date, timezone, song, image, and message customization.

The visual design, birthday letter, wishes, cake illustration, and original audio have been retained.
