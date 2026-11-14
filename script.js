(() => {
  'use strict';

  // Change these two values when reusing this page for another birthday.
  const BIRTHDAY_DATE = '2027-02-15'; // YYYY-MM-DD
  const BIRTHDAY_TIME_ZONE = 'Asia/Kolkata'; // IANA timezone, e.g. Asia/Kolkata
  const CANDLE_AGE = '20'; // Update this value to change the birthday numeral candles.

  const $ = (id) => document.getElementById(id);
  document.querySelectorAll('#candleAge, .wax-highlight').forEach((numeral) => { numeral.textContent = CANDLE_AGE; });
  const dateLabel = $('dateLabel');
  const timer = $('timer');
  const countTitle = $('count-title');
  const countFoot = $('countFoot');
  const heroEyebrow = $('heroEyebrow');
  const pad = (value, length = 2) => String(value).padStart(length, '0');

  function dateParts(date, timeZone) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date);
    return Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  }

  // Convert midnight in the configured timezone to a real UTC timestamp.
  // Iterative offset calculation also handles daylight-saving transitions.
  function zonedMidnight(dateString, timeZone) {
    const [year, month, day] = dateString.split('-').map(Number);
    const desired = Date.UTC(year, month - 1, day, 0, 0, 0);
    let guess = desired;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date(guess));
      const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, Number(part.value)]));
      const represented = Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute, values.second);
      guess += desired - represented;
    }
    return new Date(guess);
  }

  const target = zonedMidnight(BIRTHDAY_DATE, BIRTHDAY_TIME_ZONE);
  const birthdayFormatter = new Intl.DateTimeFormat('en', {
    timeZone: BIRTHDAY_TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  function updateCountdown() {
    const now = new Date();
    const remaining = target.getTime() - now.getTime();
    dateLabel.textContent = `${birthdayFormatter.format(target)} · ${BIRTHDAY_TIME_ZONE}`;

    if (remaining <= 0) {
      const today = dateParts(now, BIRTHDAY_TIME_ZONE);
      const [year, month, day] = BIRTHDAY_DATE.split('-');
      if (today.year === year && today.month === month && today.day === day) {
        heroEyebrow.textContent = 'a tiny surprise, just for today';
        countTitle.textContent = 'Happy birthday, Khushi ji!';
        countFoot.textContent = 'Wishing you a beautiful day and a wonderful year ahead';
        timer.setAttribute('aria-label', 'It is Khushi ji’s birthday today');
        ['days', 'hours', 'minutes', 'seconds'].forEach((id) => { $(id).textContent = '♡'; });
      } else {
        heroEyebrow.textContent = 'a little birthday keepsake, made just for you';
        countTitle.textContent = 'A birthday worth celebrating';
        countFoot.textContent = 'Hope your birthday was filled with warmth, laughter, and lovely moments';
        timer.setAttribute('aria-label', 'The birthday date has passed');
        ['days', 'hours', 'minutes', 'seconds'].forEach((id) => { $(id).textContent = '—'; });
      }
      return;
    }

    heroEyebrow.textContent = 'a little surprise, made just for you';
    countTitle.textContent = 'Counting down to your day';
    countFoot.textContent = 'A new year of possibilities is on its way ✿';
    const seconds = Math.floor(remaining / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    $('days').textContent = pad(days, 3);
    $('hours').textContent = pad(hours);
    $('minutes').textContent = pad(minutes);
    $('seconds').textContent = pad(secs);
    timer.setAttribute('aria-label', `${days} days, ${hours} hours, ${minutes} minutes, and ${secs} seconds until the birthday`);
  }

  if (dateLabel && timer && countTitle && countFoot && heroEyebrow) { updateCountdown(); window.setInterval(updateCountdown, 1000); }

  if ($('beginButton')) $('beginButton').addEventListener('click', () => {
    $('birthday-note').scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => $('envelopeButton').focus({ preventScroll: true }), 500);
  });

  const envelope = $('envelopeButton');
  const letterContent = $('letterContent');
  if (envelope && letterContent) {
    envelope.addEventListener('click', () => {
      const opened = envelope.getAttribute('aria-expanded') === 'true';
      envelope.setAttribute('aria-expanded', String(!opened));
      envelope.classList.toggle('is-open', !opened);
      letterContent.hidden = opened;
      const prompt = envelope.querySelector('.envelope-prompt');
      if (prompt) prompt.firstChild.textContent = opened ? 'open your note ' : 'close your note ';
      if (!opened) letterContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  const letterCursor = $('letterCursor');
  const letterLines = [[$('typedGreeting'), 'Dear Khushi ji,'], [$('typedParagraphOne'), 'Wishing you a very happy birthday! I hope today brings you gentle moments, your favourite little joys, and plenty of reasons to smile.'], [$('typedParagraphTwo'), 'May the year ahead be kind to you—full of good health, peaceful days, exciting opportunities, and success in everything you choose to pursue.'], [$('typedParagraphThree'), 'Hope you have a beautiful day and a wonderful year ahead.'], [$('typedSignature'), 'With warm wishes ♡']];
  if (letterCursor && letterLines.every(([line]) => line)) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      letterLines.forEach(([line,text]) => { line.textContent = text; }); letterLines[4][0].classList.add('signature-visible'); letterCursor.hidden = true;
    } else {
      let lineIndex=0,charIndex=0,typingTimer;
      const typeNext=()=>{const [line,text]=letterLines[lineIndex];line.append(text.charAt(charIndex++));line.appendChild(letterCursor);if(charIndex<text.length)typingTimer=window.setTimeout(typeNext,38+Math.random()*22);else if(++lineIndex<letterLines.length){charIndex=0;typingTimer=window.setTimeout(()=>{if(lineIndex===4)letterLines[4][0].classList.add('signature-visible');typeNext();},lineIndex===4?600:850);}else letterCursor.hidden=true;};
      typeNext();window.addEventListener('pagehide',()=>window.clearTimeout(typingTimer),{once:true});
    }
  }
  const fullLetter = $('fullLetter');
  if (fullLetter) {
    const interaction = new AbortController();
    fullLetter.addEventListener('pointermove', (event) => {
      const bounds = fullLetter.getBoundingClientRect();
      fullLetter.style.setProperty('--px', `${(event.clientX - bounds.left) / bounds.width * 100}%`);
      fullLetter.style.setProperty('--py', `${(event.clientY - bounds.top) / bounds.height * 100}%`);
      fullLetter.classList.add('is-revealed');
    }, { passive: true, signal: interaction.signal });
    fullLetter.addEventListener('pointerleave', () => fullLetter.classList.remove('is-revealed'), { signal: interaction.signal });
    fullLetter.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') fullLetter.classList.toggle('is-revealed');
    }, { passive: true, signal: interaction.signal });
    window.addEventListener('pagehide', () => interaction.abort(), { once: true });
  }

  let toastTimer;
  document.querySelectorAll('.wish-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('revealed')) return;
      card.classList.add('revealed');
      const answer = card.querySelector('.wish-answer');
      answer.textContent = card.dataset.wish || 'Wishing you a lovely year ahead.';
      card.setAttribute('aria-label', `${card.querySelector('.wish-card-label').textContent}: ${answer.textContent}`);
      const toast = $('toast');
      toast.textContent = 'A little wish, just for you ✿';
      toast.classList.add('show');
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
    });
  });

  const cakeWishButton = $('cakeWishButton');
  const cakeMini = $('cakeMini');
  const cakeWishMini = $('wishExperience');
  const cakeWishInput = $('cakeWishInput');
  const cakeWishStatus = $('cakeWishStatus');
  if (cakeWishButton && cakeMini && cakeWishMini && cakeWishInput && cakeWishStatus) {
    cakeWishMini.addEventListener('submit', (event) => {
      event.preventDefault();
      if (cakeWishMini.classList.contains('wish-submitted')) return;
      if (!cakeWishInput.value.trim()) {
        cakeWishStatus.textContent = 'Write a little wish first, then send it among the stars. ♡';
        cakeWishInput.focus();
        return;
      }
      cakeWishMini.classList.add('wish-submitted');
      cakeMini.classList.add('cake-mini-extinguishing');
      cakeWishInput.readOnly = true;
      cakeWishButton.disabled = true;
      cakeWishButton.innerHTML = 'Wish sent <span aria-hidden="true">♥</span>';
      cakeWishStatus.textContent = 'Sending your wish among the stars…';
      window.setTimeout(() => {
        cakeMini.classList.add('cake-mini-extinguished');
        cakeWishStatus.textContent = 'Your wish has been sent to the universe. ♡';
        cakeWishStatus.classList.add('wish-confirmed');
      }, 1350);
    });
  }

  $('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const audio = $('birthdayAudio');
  const songToggle = $('songToggle');
  const songProgress = $('songProgress');
  const songCurrent = $('songCurrent');
  const songDuration = $('songDuration');
  const songStatus = $('songStatus');
  const songClock = (time) => {
    if (!Number.isFinite(time) || time < 0) return '0:00';
    const whole = Math.floor(time);
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
  };

  const paintSongProgress = () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const ratio = duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
    songProgress.value = String(ratio);
    songProgress.style.setProperty('--played', `${ratio}%`);
    songCurrent.textContent = songClock(current);
    songProgress.setAttribute('aria-valuetext', `${songClock(current)} of ${songClock(duration)}`);
  };
  const resetSongButton = () => {
    songToggle.setAttribute('aria-label', 'Play song');
    songToggle.setAttribute('aria-pressed', 'false');
    songToggle.innerHTML = '<span aria-hidden="true">▶</span>';
  };
  const updateSongMetadata = () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      songDuration.textContent = songClock(audio.duration);
      songProgress.disabled = false;
    }
    paintSongProgress();
  };

  ['loadedmetadata', 'durationchange', 'canplay'].forEach((eventName) => audio.addEventListener(eventName, updateSongMetadata));
  audio.addEventListener('timeupdate', paintSongProgress);
  audio.addEventListener('play', () => {
    updateSongMetadata();
    songStatus.textContent = 'Playing';
    songToggle.setAttribute('aria-label', 'Pause song');
    songToggle.setAttribute('aria-pressed', 'true');
    songToggle.innerHTML = '<span aria-hidden="true">Ⅱ</span>';
  });
  audio.addEventListener('pause', () => {
    resetSongButton();
    if (!audio.ended && !audio.error) songStatus.textContent = 'Paused';
  });
  audio.addEventListener('waiting', () => { songStatus.textContent = 'Loading audio…'; });
  audio.addEventListener('playing', () => { songStatus.textContent = 'Playing'; });
  audio.addEventListener('ended', () => {
    resetSongButton();
    songStatus.textContent = 'Finished';
    paintSongProgress();
  });
  audio.addEventListener('error', () => {
    resetSongButton();
    songStatus.textContent = 'Audio unavailable. Try refreshing the page.';
    songDuration.textContent = '—:—';
    songProgress.disabled = true;
  });

  songToggle.addEventListener('click', async () => {
    if (audio.paused) {
      songStatus.textContent = 'Loading…';
      try {
        await audio.play();
      } catch (error) {
        resetSongButton();
        songStatus.textContent = error && error.name === 'NotAllowedError'
          ? 'Playback was blocked. Tap Play again to retry.'
          : 'Unable to play the song. Check your connection and try again.';
      }
    } else {
      audio.pause();
    }
  });
  songProgress.addEventListener('input', () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = (Number(songProgress.value) / 100) * audio.duration;
    paintSongProgress();
  });
  paintSongProgress();
})();
