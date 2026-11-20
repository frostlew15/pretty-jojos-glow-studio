const SALON_WHATSAPP_NUMBER = "254714396288";
const SALON_INSTAGRAM_URL = "https://www.instagram.com/pretty_lil.jojo/";

const bookingForm = document.querySelector("#booking-form");
const bookingDate = document.querySelector("#appointment-date");
const bookingService = document.querySelector("#service");
const statusMessage = document.querySelector("#form-status");
const whatsappLink = document.querySelector("#whatsapp-link");
const instagramLink = document.querySelector("#instagram-link");
const bookingQr = document.querySelector("#booking-qr");
const topQr = document.querySelector("#top-qr");

function buildWhatsAppUrl(message) {
  const baseUrl = SALON_WHATSAPP_NUMBER
    ? `https://wa.me/${SALON_WHATSAPP_NUMBER}`
    : "https://wa.me/";
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

const helloMessage = "Hi Pretty Jojo's Glow Studio! I'd love to ask about booking an appointment.";
whatsappLink.href = buildWhatsAppUrl(helloMessage);
instagramLink.href = SALON_INSTAGRAM_URL;
const websiteUrl = new URL(window.location.href);
websiteUrl.hash = "";
websiteUrl.search = "";
const websiteAddress = websiteUrl.href;
const websiteQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=svg&data=${encodeURIComponent(websiteAddress)}`;
bookingQr.src = websiteQrUrl;
topQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&format=svg&data=${encodeURIComponent(websiteAddress)}`;
document.querySelector("#current-year").textContent = new Date().getFullYear();

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];
bookingDate.min = localToday;

document.querySelectorAll("[data-book-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const option = Array.from(bookingService.options).find(
      (item) => item.value === link.dataset.bookService || item.textContent === link.dataset.bookService
    );
    if (option) bookingService.value = option.value;
  });
});

document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const isExpanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isExpanded));
  button.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  document.querySelector("#site-nav").classList.toggle("is-open", !isExpanded);
});

document.querySelectorAll("#site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
    document.querySelector(".menu-toggle").setAttribute("aria-label", "Open navigation");
    document.querySelector("#site-nav").classList.remove("is-open");
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const booking = new FormData(bookingForm);
  const message = [
    "Hi Pretty Jojo's Glow Studio! I'd like to request an appointment.",
    "",
    `Name: ${booking.get("name")}`,
    `My WhatsApp: ${booking.get("phone")}`,
    `Service: ${booking.get("service")}`,
    `Preferred date: ${booking.get("date")}`,
    `Preferred time: ${booking.get("time")}`,
  ].join("\n");

  statusMessage.textContent = "Your WhatsApp message is ready. Send it to request your appointment.";
  window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
});