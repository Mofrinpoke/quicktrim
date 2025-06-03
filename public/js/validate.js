// ファイル: public/js/validate.js

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function parseTime(str) {
  const parts = str.split(":").map(Number);
  if (parts.length !== 3) return 0;
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

document.addEventListener("DOMContentLoaded", () => {
  const preview = document.getElementById("preview");
  const startInput = document.getElementById("start_time");
  const endInput = document.getElementById("end_time");
  const rangeStart = document.getElementById("range_start");
  const rangeEnd = document.getElementById("range_end");

  if (!preview) return;

  preview.addEventListener("loadedmetadata", () => {
    const duration = preview.duration;
    rangeStart.max = 100;
    rangeEnd.max = 100;
    document.getElementById("video_duration").textContent = formatTime(duration);
  });

  // スライダーからテキストへ反映
  rangeStart.addEventListener("input", () => {
    if (!isNaN(preview.duration)) {
      const time = preview.duration * (rangeStart.value / 100);
      startInput.value = formatTime(time);
    }
  });

  rangeEnd.addEventListener("input", () => {
    if (!isNaN(preview.duration)) {
      const time = preview.duration * (rangeEnd.value / 100);
      endInput.value = formatTime(time);
    }
  });

  // テキストからスライダーへ反映
  startInput.addEventListener("change", () => {
    if (!isNaN(preview.duration)) {
      const seconds = parseTime(startInput.value);
      rangeStart.value = Math.floor((seconds / preview.duration) * 100);
    }
  });

  endInput.addEventListener("change", () => {
    if (!isNaN(preview.duration)) {
      const seconds = parseTime(endInput.value);
      rangeEnd.value = Math.floor((seconds / preview.duration) * 100);
    }
  });
});

// ファイル: public/js/validate.js

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function parseTime(str) {
  const parts = str.split(":").map(Number);
  if (parts.length !== 3) return 0;
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

document.addEventListener("DOMContentLoaded", () => {
  const preview = document.getElementById("preview");
  const startInput = document.getElementById("start_time");
  const endInput = document.getElementById("end_time");
  const rangeStart = document.getElementById("range_start");
  const rangeEnd = document.getElementById("range_end");

  if (!preview) return;

  preview.addEventListener("loadedmetadata", () => {
    const duration = preview.duration;
    rangeStart.max = 100;
    rangeEnd.max = 100;
    document.getElementById("video_duration").textContent = formatTime(duration);
  });

  // スライダーからテキストへ反映
  rangeStart.addEventListener("input", () => {
    if (!isNaN(preview.duration)) {
      const time = preview.duration * (rangeStart.value / 100);
      startInput.value = formatTime(time);
    }
  });

  rangeEnd.addEventListener("input", () => {
    if (!isNaN(preview.duration)) {
      const time = preview.duration * (rangeEnd.value / 100);
      endInput.value = formatTime(time);
    }
  });

  // テキストからスライダーへ反映
  startInput.addEventListener("change", () => {
    if (!isNaN(preview.duration)) {
      const seconds = parseTime(startInput.value);
      rangeStart.value = Math.floor((seconds / preview.duration) * 100);
    }
  });

  endInput.addEventListener("change", () => {
    if (!isNaN(preview.duration)) {
      const seconds = parseTime(endInput.value);
      rangeEnd.value = Math.floor((seconds / preview.duration) * 100);
    }
  });
});
