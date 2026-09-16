// Commercial WhatsApp number confirmed by the project owner.
export const contact = {
  whatsappNumber: "19546822141",
  displayNumber: "+1 (954) 682-2141",
};

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
