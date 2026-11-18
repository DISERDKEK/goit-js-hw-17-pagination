const API_KEY = '45176679-75931c399e234e7e224ff299a';
const BASE_URL = 'https://pixabay.com/api/';
export const PER_PAGE = 12;

export async function fetchImages(page = 1, category = '') {
  const params = new URLSearchParams({
    key: API_KEY,
    editors_choice: 'true',
    image_type: 'photo',
    page,
    per_page: PER_PAGE,
  });

  if (category) {
    params.append('category', category);
  }

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Помилка запиту: ${response.status}`);
  }

  return response.json();
}