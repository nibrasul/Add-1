/**
 * Dynamically draws the card's front design on an HTML Canvas.
 */
export function drawCardFront(
  canvas: HTMLCanvasElement,
  name: string,
  role: string,
  company: string,
  color: string,
  material: "pvc" | "metal",
  finish: "glossy" | "matte" | "brushed",
  logoImg: HTMLImageElement | null
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw Background
  ctx.clearRect(0, 0, w, h);
  
  if (material === "metal") {
    // Premium brushed metal gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    if (color === "#ffffff") {
      grad.addColorStop(0, "#e0e0e0");
      grad.addColorStop(0.5, "#f5f5f7");
      grad.addColorStop(1, "#d1d1d6");
    } else if (color === "#111111" || color === "#0a0a0a") {
      grad.addColorStop(0, "#1c1c1e");
      grad.addColorStop(0.5, "#2c2c2e");
      grad.addColorStop(1, "#111112");
    } else {
      // Metallic colored card
      grad.addColorStop(0, color);
      grad.addColorStop(0.5, "#ffffffaa");
      grad.addColorStop(1, color);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle brushed metal texture strokes
    if (finish === "brushed") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < h; i += 2) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }
    }
  } else {
    // PVC solid background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);

    // Subtle gloss reflections for glossy pvc
    if (finish === "glossy") {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.06)");
      grad.addColorStop(0.3, "rgba(255, 255, 255, 0.0)");
      grad.addColorStop(0.7, "rgba(0, 0, 0, 0.0)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // 2. Draw card border outline (thin metallic stroke)
  ctx.strokeStyle = material === "metal" ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // 3. Draw Contactless Chip Contact Pad (Smart Card Chip)
  const chipX = 80;
  const chipY = h / 2 - 35;
  const chipW = 75;
  const chipH = 60;
  
  // Chip Base (gold/silver)
  const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
  if (material === "metal" && color === "#ffffff") {
    chipGrad.addColorStop(0, "#d1d1d6");
    chipGrad.addColorStop(1, "#8e8e93");
  } else {
    chipGrad.addColorStop(0, "#ffe8a3");
    chipGrad.addColorStop(0.5, "#d4af37");
    chipGrad.addColorStop(1, "#aa7c11");
  }
  ctx.fillStyle = chipGrad;
  ctx.beginPath();
  ctx.roundRect?.(chipX, chipY, chipW, chipH, 8);
  ctx.fill();

  // Chip Wireframe lines
  ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(chipX + 10, chipY + 10, chipW - 20, chipH - 20);
  
  ctx.beginPath();
  ctx.moveTo(chipX + chipW / 2, chipY);
  ctx.lineTo(chipX + chipW / 2, chipY + chipH);
  ctx.moveTo(chipX, chipY + chipH / 2);
  ctx.lineTo(chipX + chipW, chipY + chipH / 2);
  ctx.stroke();

  // 4. Logo Render
  const logoSize = 64;
  const logoX = w - 144;
  const logoY = 55;

  if (logoImg) {
    // Draw uploaded logo
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
  } else {
    // Draw default abstract geometric "T" logo
    ctx.fillStyle = color === "#ffffff" ? "#111111" : "#ffffff";
    ctx.beginPath();
    // Beautiful dynamic logo shape (abstract overlapping polygons)
    ctx.moveTo(logoX + 10, logoY + 10);
    ctx.lineTo(logoX + 54, logoY + 10);
    ctx.lineTo(logoX + 54, logoY + 22);
    ctx.lineTo(logoX + 38, logoY + 22);
    ctx.lineTo(logoX + 38, logoY + 54);
    ctx.lineTo(logoX + 26, logoY + 54);
    ctx.lineTo(logoX + 26, logoY + 22);
    ctx.lineTo(logoX + 10, logoY + 22);
    ctx.closePath();
    ctx.fill();

    // Floating dot
    ctx.fillStyle = "#FF3B30";
    ctx.beginPath();
    ctx.arc(logoX + 48, logoY + 48, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Draw Typography (Name, Role, Company)
  const isDarkBg = color !== "#ffffff";
  const textPrimary = isDarkBg ? "#FFFFFF" : "#111111";
  const textSecondary = isDarkBg ? "rgba(255, 255, 255, 0.6)" : "rgba(17, 17, 17, 0.6)";

  ctx.textAlign = "left";

  // Name
  ctx.fillStyle = textPrimary;
  ctx.font = "bold 44px Outfit, system-ui, sans-serif";
  ctx.fillText(name || "John Doe", 80, h - 140);

  // Role
  ctx.fillStyle = textSecondary;
  ctx.font = "500 24px Outfit, system-ui, sans-serif";
  ctx.fillText(role || "Creative Director", 80, h - 95);

  // Company
  ctx.fillStyle = textSecondary;
  ctx.font = "bold 20px Outfit, system-ui, sans-serif";
  ctx.fillText(company || "TAPFOLIO INC.", 80, h - 55);

  // Brand Stamp
  ctx.textAlign = "right";
  ctx.fillStyle = textSecondary;
  ctx.font = "bold 14px Outfit, system-ui, sans-serif";
  ctx.fillText("TAPFOLIO NFC v2", w - 80, h - 55);
}

/**
 * Dynamically draws the card's back design.
 */
export function drawCardBack(
  canvas: HTMLCanvasElement,
  color: string,
  material: "pvc" | "metal",
  finish: "glossy" | "matte" | "brushed",
  name: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw Background
  ctx.clearRect(0, 0, w, h);
  
  if (material === "metal") {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    if (color === "#ffffff") {
      grad.addColorStop(0, "#e0e0e0");
      grad.addColorStop(0.5, "#f5f5f7");
      grad.addColorStop(1, "#d1d1d6");
    } else if (color === "#111111" || color === "#0a0a0a") {
      grad.addColorStop(0, "#1c1c1e");
      grad.addColorStop(0.5, "#2c2c2e");
      grad.addColorStop(1, "#111112");
    } else {
      grad.addColorStop(0, color);
      grad.addColorStop(0.5, "#ffffffaa");
      grad.addColorStop(1, color);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (finish === "brushed") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < h; i += 2) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }
    }
  } else {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
  }

  // Border
  ctx.strokeStyle = material === "metal" ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  const isDarkBg = color !== "#ffffff";
  const textPrimary = isDarkBg ? "#FFFFFF" : "#111111";
  const textSecondary = isDarkBg ? "rgba(255, 255, 255, 0.6)" : "rgba(17, 17, 17, 0.6)";

  // 2. Draw Simulated QR Code (Right Side)
  const qrX = w - 240;
  const qrY = h / 2 - 80;
  const qrSize = 160;

  ctx.fillStyle = textPrimary;
  // Outer frame
  ctx.lineWidth = 3;
  ctx.strokeStyle = textPrimary;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);
  
  // Custom futuristic qr alignment patterns
  ctx.fillRect(qrX + 10, qrY + 10, 40, 40);
  ctx.clearRect(qrX + 20, qrY + 20, 20, 20);
  
  ctx.fillRect(qrX + qrSize - 50, qrY + 10, 40, 40);
  ctx.clearRect(qrX + qrSize - 40, qrY + 20, 20, 20);
  
  ctx.fillRect(qrX + 10, qrY + qrSize - 50, 40, 40);
  ctx.clearRect(qrX + 20, qrY + qrSize - 40, 20, 20);

  // Tiny tech blocks simulating QR pixels
  ctx.fillStyle = textPrimary;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      // Don't overwrite the 3 big corner anchors
      if ((r < 3 && c < 3) || (r < 3 && c > 4) || (r > 4 && c < 3)) continue;
      // Random grid pattern
      if ((Math.sin(r * 12.5 + c * 33.7) > 0)) {
        ctx.fillRect(qrX + 25 + c * 15, qrY + 25 + r * 15, 10, 10);
      }
    }
  }

  // 3. Draw Contactless Waves (Left Side)
  const signalX = 100;
  const signalY = h / 2;

  // Signal waves
  ctx.strokeStyle = textPrimary;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  
  // Wave 1
  ctx.beginPath();
  ctx.arc(signalX, signalY, 20, -Math.PI/3, Math.PI/3);
  ctx.stroke();

  // Wave 2
  ctx.beginPath();
  ctx.arc(signalX, signalY, 40, -Math.PI/3, Math.PI/3);
  ctx.stroke();

  // Wave 3
  ctx.beginPath();
  ctx.arc(signalX, signalY, 60, -Math.PI/3, Math.PI/3);
  ctx.stroke();

  // Tap Icon
  ctx.fillStyle = textPrimary;
  ctx.font = "bold 16px Outfit, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("TAP TO SHARE", signalX + 60, signalY + 5);

  // 4. URL and Instructions
  const formattedSlug = (name || "John Doe").toLowerCase().replace(/[^a-z0-9]+/g, "");
  ctx.fillStyle = textSecondary;
  ctx.font = "bold 20px Outfit, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`tapfolio.me/${formattedSlug}`, 80, h - 55);
}

/**
 * Dynamically draws the internal NFC antenna pathway and microchip.
 */
export function drawNFCCore(
  canvas: HTMLCanvasElement,
  glowIntensity: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear background (completely transparent substrate)
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(0, 20, 10, 0.1)";
  ctx.fillRect(0, 0, w, h);

  // 1. Draw Copper Antenna Coils (Concentric rounded rects)
  ctx.strokeStyle = `rgba(212, 175, 55, ${0.4 + glowIntensity * 0.6})`;
  ctx.lineWidth = 3;

  for (let i = 0; i < 6; i++) {
    const offset = 35 + i * 12;
    ctx.beginPath();
    ctx.roundRect?.(offset, offset, w - offset * 2, h - offset * 2, 24);
    ctx.stroke();
  }

  // 2. Connect antenna lines to the center chip
  const chipX = w / 2;
  const chipY = h / 2;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 80, h / 2);
  ctx.lineTo(chipX - 30, chipY);
  ctx.moveTo(w / 2 + 80, h / 2);
  ctx.lineTo(chipX + 30, chipY);
  ctx.stroke();

  // 3. Draw Silicon Microchip Base
  ctx.fillStyle = "#1e1e1e";
  ctx.strokeStyle = "#3a3a3a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect?.(chipX - 35, chipY - 35, 70, 70, 8);
  ctx.fill();
  ctx.stroke();

  // Draw gold contacts on the chip
  ctx.fillStyle = `rgba(212, 175, 55, ${0.7 + glowIntensity * 0.3})`;
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(chipX - 25 + i * 15, chipY - 25, 8, 12);
    ctx.fillRect(chipX - 25 + i * 15, chipY + 13, 8, 12);
  }

  // Core microprocessor dot
  ctx.fillStyle = glowIntensity > 0.1 ? `rgba(255, 59, 48, ${glowIntensity})` : "#333";
  ctx.beginPath();
  ctx.arc(chipX, chipY, 8, 0, Math.PI * 2);
  ctx.fill();
}
