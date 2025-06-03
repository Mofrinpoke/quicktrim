// public/js/donation_popup.js
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.createElement('div');
  popup.id = 'donation-popup';
  popup.innerHTML = `
    <div class="popup-inner">
      <h2>応援してくれたら嬉しいです ☕</h2>
      <div class="options">
        <button data-price="100">100円</button>
        <button data-price="300">300円</button>
        <button data-price="500">500円</button>
        <button data-price="1000">1000円</button>
        <button data-price="10000">10000円</button>
      </div>
      <div id="donation-message" style="margin-top: 1rem;"></div>
      <button id="close-donation" style="margin-top: 1rem;">閉じる</button>
    </div>
  `;
  document.body.appendChild(popup);

  const messages = {
    100: "明日のブレイクタイムにコーヒー飲むね！ありがとう！",
    300: "今日のおやつにするね🍪ありがとう！",
    500: "ランチ代にするね！感謝！",
    1000: "もう泣きそう、ありがとう...😭",
    10000: "え、旅行プレゼントしようとしてる…？ありがとう！！！"
  };

  document.querySelectorAll('#donation-popup button[data-price]').forEach(btn => {
    btn.addEventListener('click', () => {
      const price = btn.dataset.price;
      document.getElementById('donation-message').innerText = messages[price];
    });
  });

  document.getElementById('close-donation').addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // 最初は非表示
  popup.style.display = 'none';
});

// 外部から表示を呼び出す用
function showDonationPopup() {
  const popup = document.getElementById('donation-popup');
  if (popup) popup.style.display = 'flex';
}
