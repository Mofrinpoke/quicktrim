// public/js/silence_viewer.js

document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("preview");
  const bar = document.getElementById("silence-bar");

  if (!video || !bar || !window.silenceDataUrl) return;

  fetch(window.silenceDataUrl)
    .then(res => res.json())
    .then(silences => {
      const renderSilences = () => {
        const duration = video.duration;
        if (!duration || !silences.length) return;

        bar.innerHTML = ""; // 既存をクリア

        silences.forEach((s, i) => {
          const left = (s.start / duration) * 100;
          const width = ((s.end - s.start) / duration) * 100;

          const block = document.createElement("div");
          block.className = "silence-block";
          block.style.position = 'absolute';
          block.style.left = `${left}%`;
          block.style.width = `${width}%`;
          block.style.top = '0';
          block.style.bottom = '0';
          block.style.backgroundColor = 'red';
          block.style.borderRadius = '4px';
          block.title = `無音: ${formatTime(s.start)} - ${formatTime(s.end)}`;

          bar.appendChild(block);
        });
      };

      if (video.readyState >= 1) {
        renderSilences();
      } else {
        video.addEventListener("loadedmetadata", renderSilences, { once: true });
      }
    })
    .catch(err => {
      console.warn("無音データの読み込みに失敗しました:", err);
    });

  function formatTime(sec) {
    sec = parseFloat(sec);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    const m = Math.floor(sec / 60 % 60).toString().padStart(2, '0');
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
});
