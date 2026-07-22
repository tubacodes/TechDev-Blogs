const searchInput = document.querySelector("#search-input");
const resultsContainer = document.querySelector("#search-results");

let debounceTimer;

searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimer);
  const term = e.target.value.trim();

  if (!term) {
    resultsContainer.innerHTML = "";
    resultsContainer.classList.remove("show");
    return;
  }

  debounceTimer = setTimeout(async () => {
    try {
      const res = await fetch(`/search?q=${encodeURIComponent(term)}`);
      const posts = await res.json();

      resultsContainer.innerHTML = "";

      if (posts.length === 0) {
        resultsContainer.innerHTML = `<li class="empty-result">No posts found</li>`;
        resultsContainer.classList.add("show");
        return;
      }

      posts.forEach((post) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="/posts/${post.id}">${post.title}</a>`;
        resultsContainer.appendChild(li);
      });

      resultsContainer.classList.add("show");
    } catch (err) {
      console.error("Search failed:", err);
      resultsContainer.classList.remove("show");
    }
  }, 300);
});