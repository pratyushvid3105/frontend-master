const BASE_URL = "https://api.frontendexpert.io/api/fe/glossary-suggestions";

let timeoutId;

const typeahead = document.getElementById("typeahead");
const suggestionsList = document.getElementById("suggestions-list");
typeahead.addEventListener("input", handleSearch);

function handleSearch() {
  if (typeahead.value.length === 0) {
    clearSuggestions();
    return;
  }

  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    fetchDataAndAppend();
  }, 500);
}

async function fetchDataAndAppend() {
  const url = new URL(BASE_URL);
  url.searchParams.set("text", typeahead.value);
  const response = await fetch(url);
  const suggestions = await response.json();
  const fragment = document.createDocumentFragment();
  suggestions.forEach((suggestion) => {
    fragment.appendChild(createSuggestionElement(suggestion));
  });
  suggestionsList.replaceChildren(fragment);
}

function createSuggestionElement(suggestion) {
  const listElement = document.createElement("li");
  listElement.textContent = suggestion;
  listElement.addEventListener("click", () => {
    typeahead.value = suggestion;
    clearSuggestions();
  });
  return listElement;
}

function clearSuggestions() {
  clearTimeout(timeoutId);
  suggestionsList.innerHTML = "";
}
