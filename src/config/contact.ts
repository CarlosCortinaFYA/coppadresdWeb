// Número de WhatsApp de Vita (bot) confirmado por el owner el 18-11-2026.
// El +1 (954) 682-2141 queda como línea comercial/ventas y no atiende el bot.
export const contact = {
  whatsappNumber: "18654207919",
  displayNumber: "+1 (865) 420-7919",
};

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
