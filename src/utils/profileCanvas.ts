/**
 * Dynamically draws the mobile phone profile screen based on scroll position.
 * @param canvas HTML Canvas to draw on
 * @param scrollY Scroll offset in pixels (0 to maxScroll)
 */
export function drawProfileScreen(
  canvas: HTMLCanvasElement,
  scrollY: number,
  name: string,
  role: string,
  company: string,
  color: string,
  avatarImg?: HTMLImageElement | null,
  projectImg?: HTMLImageElement | null
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;   // Standard phone aspect, e.g., 512
  const h = canvas.height;  // Height, e.g., 1024 (long scrollable area)

  // Clear screen (obsidian dark theme)
  ctx.fillStyle = "#0c0c0e";
  ctx.fillRect(0, 0, w, h);

  // We will clip the viewport to simulate the screen, but since this canvas is mapped
  // directly as a texture, we can draw the entire page shifted up by `scrollY`.
  // Let's draw the page components relative to y = -scrollY.

  const startY = -scrollY;

  // 1. Header (Static/Sticky Status Bar Mock)
  // Time, Battery, Wifi
  ctx.fillStyle = "#1e1e24";
  ctx.fillRect(0, 0, w, 44);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px Outfit, sans-serif";
  ctx.fillText("9:41", 24, 26);
  // Battery bar icon
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(w - 48, 16, 24, 12);
  ctx.fillRect(w - 44, 18, 16, 8);

  // 2. Profile Cover Banner
  const bannerH = 160;
  const bannerY = startY + 44;
  const grad = ctx.createLinearGradient(0, bannerY, 0, bannerY + bannerH);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "#121216");
  ctx.fillStyle = grad;
  ctx.fillRect(0, bannerY, w, bannerH);

  // 3. Profile Avatar Circle
  const avatarR = 50;
  const avatarX = w / 2;
  const avatarY = bannerY + bannerH; // sits on the banner line
  
  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = "#222";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#0c0c0e";
  ctx.stroke();
  
  if (avatarImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
    ctx.restore();
  } else {
    // Draw an abstract profile avatar icon (initials or user figure)
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const initials = (name || "JD").split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    ctx.fillText(initials || "JD", avatarX, avatarY);
  }
  ctx.restore();

  // 4. Name, Title, and Company
  const contentY = avatarY + 70;
  ctx.textAlign = "center";
  
  // Name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Outfit, sans-serif";
  ctx.fillText(name || "John Doe", w / 2, contentY);

  // Role & Company
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "500 16px Outfit, sans-serif";
  ctx.fillText(`${role || "Creative Director"} at ${company || "TapFolio"}`, w / 2, contentY + 28);

  // 5. Social Links Panel (Scroll 2)
  const socialY = contentY + 70;
  const socialPlatforms = ["LinkedIn", "Twitter", "Instagram", "GitHub"];
  const buttonW = 380;
  const buttonH = 48;
  const gap = 14;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  socialPlatforms.forEach((platform, i) => {
    const yPos = socialY + i * (buttonH + gap);
    
    // Glassmorphic button background
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect?.(w / 2 - buttonW / 2, yPos, buttonW, buttonH, 12);
    ctx.fill();
    ctx.stroke();

    // Icon circle mockup
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(w / 2 - buttonW / 2 + 30, yPos + buttonH / 2, 12, 0, Math.PI * 2);
    ctx.fill();

    // Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Outfit, sans-serif";
    ctx.fillText(platform, w / 2, yPos + buttonH / 2);
  });

  // 6. Portfolio Grid Section (Scroll 3)
  const portY = socialY + socialPlatforms.length * (buttonH + gap) + 40;
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px Outfit, sans-serif";
  ctx.fillText("Portfolio", 66, portY);

  const gridW = 380;
  const cellW = (gridW - 16) / 2;
  const cellH = 110;
  
  // Draw 4 portfolio cards
  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const itemX = w / 2 - gridW / 2 + col * (cellW + 16);
    const itemY = portY + 25 + row * (cellH + 16);

    // Grid Cell
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect?.(itemX, itemY, cellW, cellH, 8);
    ctx.fill();
    ctx.stroke();

    // Draw dummy photo or real photo inside cell
    if (projectImg) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect?.(itemX + 8, itemY + 8, cellW - 16, 60, 4);
      ctx.clip();
      ctx.drawImage(projectImg, itemX + 8, itemY + 8, cellW - 16, 60);
      ctx.restore();
    } else {
      ctx.fillStyle = `rgba(${100 + i * 30}, ${120 + i * 20}, 200, 0.15)`;
      ctx.fillRect(itemX + 8, itemY + 8, cellW - 16, 60);
    }

    // Title
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "bold 12px Outfit, sans-serif";
    ctx.fillText(`Project 0${i + 1}`, itemX + 10, itemY + 88);
  }

  // 7. Contact Button Section (Scroll 4)
  const contactY = portY + 25 + 2 * (cellH + 16) + 30;
  ctx.textAlign = "center";
  
  // Glow shadow for contact CTA
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect?.(w / 2 - buttonW / 2, contactY, buttonW, 54, 27);
  ctx.fill();
  
  // Reset shadow
  ctx.shadowBlur = 0;

  ctx.fillStyle = color === "#ffffff" ? "#111111" : "#ffffff";
  ctx.font = "bold 16px Outfit, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("Add to Contacts", w / 2, contactY + 27);

  // 8. Analytics Dashboard Section (Scroll 5)
  const statsY = contactY + 54 + 50;
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px Outfit, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Analytics Insight", 66, statsY);

  // Stats Card
  const statsCardH = 180;
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect?.(w / 2 - buttonW / 2, statsY + 15, buttonW, statsCardH, 16);
  ctx.fill();
  ctx.stroke();

  // Draw a miniature neon chart inside stats card
  const chartX = w / 2 - buttonW / 2 + 24;
  const chartY = statsY + 130;
  const chartW = buttonW - 48;
  const chartH = 50;

  // Chart Grid Lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(chartX, chartY);
  ctx.lineTo(chartX + chartW, chartY);
  ctx.moveTo(chartX, chartY - 25);
  ctx.lineTo(chartX + chartW, chartY - 25);
  ctx.moveTo(chartX, chartY - 50);
  ctx.lineTo(chartX + chartW, chartY - 50);
  ctx.stroke();

  // Chart line
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(chartX, chartY - 5);
  ctx.bezierCurveTo(chartX + 80, chartY - 15, chartX + 120, chartY - 45, chartX + 180, chartY - 30);
  ctx.bezierCurveTo(chartX + 220, chartY - 20, chartX + 280, chartY - 60, chartX + chartW, chartY - 50);
  ctx.stroke();

  // Metrics
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px Outfit, sans-serif";
  ctx.fillText("+142%", w / 2 - buttonW / 2 + 24, statsY + 50);
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "12px Outfit, sans-serif";
  ctx.fillText("NFC Taps Growth this week", w / 2 - buttonW / 2 + 24, statsY + 70);
}
