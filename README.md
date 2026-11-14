# A Little Birthday Wish for Khushi ji

A responsive, pastel scrapbook-style birthday greeting with an interactive letter, revealable wishes, bouquet and cake illustrations, a timezone-aware countdown, and a playable birthday song.

## Run locally

Requires Node.js 18 or newer.

```sh
node scripts/serve.cjs
```

Then open `http://localhost:4173`.

## Customize the birthday

Open `script.js` and edit the two settings at the top:

```js
const BIRTHDAY_DATE = '2027-02-15';
const BIRTHDAY_TIME_ZONE = 'Asia/Kolkata';
```

Use `YYYY-MM-DD` for the date and a valid IANA timezone such as `Asia/Kolkata`, `Europe/London`, or `America/New_York`. The countdown reaches midnight in the configured timezone, not the visitor's device timezone. The page automatically changes its message on the birthday and after it has passed.

## Replace the song

Replace `a-little-light-for-your-day.mp3` with your audio file, keeping the same filename, or update both the `<source>` and download link in `index.html`. The player reports loading, playing, paused, finished, and error states. Browsers may block playback until the visitor presses Play; autoplay is intentionally not used.

## Replace the bouquet image

The page uses `khushi-flower-bouquet.webp`. Replace it with another WebP image using the same filename, or update the image path in `index.html`. Keep the PNG original if you need a lossless source copy.

## Customize the message and wishes

Edit the greeting paragraphs and section text in `index.html`. Each wish card uses a `data-wish` attribute; change its value to customize the revealed message.

## Deploy

This is a static site. Publish the project root to Vercel or any static hosting provider. The included `vercel.json` serves the repository root directly. No build step or package installation is required.
