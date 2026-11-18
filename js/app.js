import { fetchImages, PER_PAGE } from './js/pixabay-api.js';

const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more-btn');
const categorySelect = document.getElementById('category-select');
const resetBtn = document.getElementById('reset-btn');
const message = document.getElementById('message');
const pageInfo = document.getElementById('page-info');

let page = Number(localStorage.getItem('pixabay_page')) || 1;
let category = localStorage.getItem('pixabay_category') || '';
categorySelect.value = category;

function renderImages(images) {
  const markup = images
    .map(
      (img) => `
      <li class="gallery-item">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
        <div class="gallery-info">
          <span>Автор: ${img.user}</span>
          <span>❤️ ${img.likes}</span>
        </div>
      </li>
    `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

async function loadImages() {
  loadMoreBtn.disabled = true;
  message.textContent = 'Loading...';

  try {
    const data = await fetchImages(page, category);
    const images = data.hits;

    if (images.length === 0) {
      message.textContent = 'No images found.';
      loadMoreBtn.classList.add('is-hidden');
      return;
    }

    renderImages(images);
    message.textContent = '';

    localStorage.setItem('pixabay_page', page);
    localStorage.setItem('pixabay_category', category);

    const totalPages = Math.ceil(data.totalHits / PER_PAGE);
    pageInfo.textContent = `Сторінка ${page} із ${totalPages}`;

    if (page >= totalPages) {
      loadMoreBtn.classList.add('is-hidden');
      message.textContent = 'Ви переглянули всі доступні зображення.';
    } else {
      loadMoreBtn.classList.remove('is-hidden');
    }

    page += 1;
  } catch (error) {
    message.textContent = `Не вдалося завантажити дані: ${error.message}`;
  } finally {
    loadMoreBtn.disabled = false;
  }
}

loadMoreBtn.addEventListener('click', loadImages);

categorySelect.addEventListener('change', () => {
  category = categorySelect.value;
  page = 1;
  gallery.innerHTML = '';
  loadImages();
});

resetBtn.addEventListener('click', () => {
  category = '';
  categorySelect.value = '';
  page = 1;
  gallery.innerHTML = '';
  localStorage.removeItem('pixabay_page');
  localStorage.removeItem('pixabay_category');
  loadImages();
});

loadImages();