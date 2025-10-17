const API_BASE_URL = "https://api.frontendexpert.io/api/fe/testimonials";

let afterID;
let canFetchOnScroll = true;

const testimonialContainer = document.getElementById("testimonial-container");

testimonialContainer.addEventListener("scroll", handleScroll);

fetchTestimonials();

function handleScroll() {
  if (!canFetchOnScroll) {
    return;
  }
  const scrollHeightFromBottom =
    this.scrollHeight - (this.scrollTop + this.clientHeight);
  if (scrollHeightFromBottom > 0) {
    return;
  }
  fetchTestimonials();
}

async function fetchTestimonials() {
  canFetchOnScroll = false;
  const url = createTestimonialUrl();
  const response = await fetch(url);
  const { hasNext, testimonials } = await response.json();
  testimonials.forEach((testimonial) => {
    const testimonialElement = document.createElement("p");
    testimonialElement.className = "testimonial";
    testimonialElement.textContent = testimonial.message;
    testimonialContainer.appendChild(testimonialElement);
  });
  if (!hasNext) {
    testimonialContainer.removeEventListener("scroll", handleScroll);
  } else {
    afterID = testimonials[testimonials.length - 1].id;
  }
  canFetchOnScroll = true;
}

function createTestimonialUrl() {
  const url = new URL(API_BASE_URL);
  url.searchParams.set("limit", 5);

  if (afterID != null) {
    url.searchParams.set("after", afterID);
  }
  return url;
}
