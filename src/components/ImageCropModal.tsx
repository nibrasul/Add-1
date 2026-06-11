'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './ImageCropModal.module.css';

interface ImageCropModalProps {
  imageSrc: string;
  onCropDone: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropModal({ imageSrc, onCropDone, onCancel }: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  // Transform state
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // Drag state
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  // Crop circle size
  const CROP_SIZE = 260;
  const CANVAS_SIZE = 340;

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgEl(img);
      // Fit image so the shorter side fills the crop circle
      const fitScale = CROP_SIZE / Math.min(img.width, img.height);
      setScale(fitScale);
      setOffsetX(0);
      setOffsetY(0);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Draw on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imgEl) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = CROP_SIZE / 2;

    ctx.clearRect(0, 0, w, h);

    // Draw image centered + transformed
    const imgW = imgEl.width * scale;
    const imgH = imgEl.height * scale;
    const imgX = cx - imgW / 2 + offsetX;
    const imgY = cy - imgH / 2 + offsetY;
    ctx.drawImage(imgEl, imgX, imgY, imgW, imgH);

    // Draw dark overlay outside crop circle
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
    ctx.restore();

    // Draw circle border
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }, [imgEl, scale, offsetX, offsetY]);

  useEffect(() => {
    draw();
  }, [draw]);

  // ─── Drag handlers ───
  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offsetX, oy: offsetY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffsetX(dragStart.current.ox + dx);
    setOffsetY(dragStart.current.oy + dy);
  };

  const onPointerUp = () => {
    setDragging(false);
  };

  // ─── Zoom slider ───
  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  // Compute min/max scale based on image
  const minScale = imgEl ? (CROP_SIZE / Math.max(imgEl.width, imgEl.height)) * 0.5 : 0.1;
  const maxScale = imgEl ? (CROP_SIZE / Math.min(imgEl.width, imgEl.height)) * 4 : 5;

  // ─── Crop and export ───
  const handleCrop = () => {
    if (!imgEl) return;

    const outputSize = 512; // final export resolution
    const outCanvas = document.createElement('canvas');
    outCanvas.width = outputSize;
    outCanvas.height = outputSize;
    const outCtx = outCanvas.getContext('2d')!;

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    const r = CROP_SIZE / 2;

    // The crop circle top-left in canvas coords
    const cropLeft = cx - r;
    const cropTop = cy - r;

    // Where the image is drawn on the display canvas
    const imgW = imgEl.width * scale;
    const imgH = imgEl.height * scale;
    const imgX = cx - imgW / 2 + offsetX;
    const imgY = cy - imgH / 2 + offsetY;

    // Source rectangle in the original image
    const srcX = (cropLeft - imgX) / scale;
    const srcY = (cropTop - imgY) / scale;
    const srcW = CROP_SIZE / scale;
    const srcH = CROP_SIZE / scale;

    // Draw circular clip
    outCtx.beginPath();
    outCtx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    outCtx.closePath();
    outCtx.clip();

    outCtx.drawImage(imgEl, srcX, srcY, srcW, srcH, 0, 0, outputSize, outputSize);

    outCanvas.toBlob(
      (blob) => {
        if (blob) onCropDone(blob);
      },
      'image/png',
      1
    );
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Crop Profile Photo</h3>
        <p className={styles.subtitle}>Drag to reposition · Pinch or slide to zoom</p>

        <div
          className={styles.canvasContainer}
          ref={containerRef}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className={styles.canvas}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          />
        </div>

        {/* Zoom slider */}
        <div className={styles.zoomRow}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M8 11h6" />
          </svg>
          <input
            type="range"
            min={minScale}
            max={maxScale}
            step={0.01}
            value={scale}
            onChange={handleZoom}
            className={styles.zoomSlider}
          />
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M8 11h6M11 8v6" />
          </svg>
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={styles.cropBtn} onClick={handleCrop}>Apply Crop</button>
        </div>
      </div>
    </div>
  );
}
