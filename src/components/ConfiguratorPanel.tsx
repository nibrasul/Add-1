"use client";

import React, { useRef } from "react";
import { Upload, Check, Smartphone, Eye, EyeOff, LayoutGrid } from "lucide-react";

interface ConfigProps {
  config: {
    name: string;
    role: string;
    company: string;
    color: string;
    material: "pvc" | "metal";
    finish: "glossy" | "matte" | "brushed";
    logoUrl: string | null;
    email: string;
    phone: string;
    website: string;
    linkedin: string;
    x: string;
    instagram: string;
    whatsapp: string;
    meetingLink: string;
    profileTheme: "light" | "dark";
    qrPosition: "front" | "back" | "hidden";
  };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const COLOR_PRESETS = [
  { name: "Obsidian Black", value: "#111111" },
  { name: "Pure Alabaster", value: "#ffffff" },
  { name: "Royal Cobalt", value: "#2563EB" },
  { name: "Forest Emerald", value: "#1a4d3e" },
  { name: "Aureum Gold", value: "#b58925" },
];

export default function ConfiguratorPanel({ config, setConfig }: ConfigProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev: any) => ({ ...prev, [name]: value }));
  };

  const selectColor = (colorVal: string) => {
    setConfig((prev: any) => ({ ...prev, color: colorVal }));
  };

  const toggleMaterial = (mat: "pvc" | "metal") => {
    const defaultFinish = mat === "metal" ? "brushed" : "matte";
    setConfig((prev: any) => ({ ...prev, material: mat, finish: defaultFinish }));
  };

  const selectFinish = (fin: "glossy" | "matte" | "brushed") => {
    setConfig((prev: any) => ({ ...prev, finish: fin }));
  };

  const selectProfileTheme = (theme: "light" | "dark") => {
    setConfig((prev: any) => ({ ...prev, profileTheme: theme }));
  };

  const selectQrPosition = (pos: "front" | "back" | "hidden") => {
    setConfig((prev: any) => ({ ...prev, qrPosition: pos }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setConfig((prev: any) => ({ ...prev, logoUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="configurator-panel">
      <h3 className="config-title font-sans">Tailor Your TapFolio</h3>
      <p className="config-subtitle">Configure details and materials in real-time.</p>

      {/* Details Inputs */}
      <div className="space-y-4">
        <div className="config-section">
          <label className="config-label">Card Holder Name</label>
          <input
            type="text"
            name="name"
            value={config.name}
            onChange={handleInputChange}
            placeholder="John Doe"
            className="config-input"
          />
        </div>

        <div className="config-section">
          <label className="config-label">Professional Role</label>
          <input
            type="text"
            name="role"
            value={config.role}
            onChange={handleInputChange}
            placeholder="Creative Director"
            className="config-input"
          />
        </div>

        <div className="config-section">
          <label className="config-label">Company Name</label>
          <input
            type="text"
            name="company"
            value={config.company}
            onChange={handleInputChange}
            placeholder="TAPFOLIO INC."
            className="config-input"
          />
        </div>

        {/* Material Selector */}
        <div className="config-section">
          <label className="config-label">Base Material</label>
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${config.material === "pvc" ? "active" : ""}`}
              onClick={() => toggleMaterial("pvc")}
            >
              Premium PVC
            </button>
            <button
              type="button"
              className={`toggle-btn ${config.material === "metal" ? "active" : ""}`}
              onClick={() => toggleMaterial("metal")}
            >
              Tactile Metal
            </button>
          </div>
        </div>

        {/* Finish Selector */}
        <div className="config-section">
          <label className="config-label">Surface Finish</label>
          <div className="toggle-group">
            {config.material === "pvc" ? (
              <>
                <button
                  type="button"
                  className={`toggle-btn ${config.finish === "matte" ? "active" : ""}`}
                  onClick={() => selectFinish("matte")}
                >
                  Soft Matte
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${config.finish === "glossy" ? "active" : ""}`}
                  onClick={() => selectFinish("glossy")}
                >
                  High Gloss
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={`toggle-btn ${config.finish === "brushed" ? "active" : ""}`}
                  onClick={() => selectFinish("brushed")}
                >
                  Brushed
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${config.finish === "matte" ? "active" : ""}`}
                  onClick={() => selectFinish("matte")}
                >
                  Satin Matte
                </button>
              </>
            )}
          </div>
        </div>

        {/* Color Selection */}
        <div className="config-section">
          <label className="config-label">Color Shell</label>
          <div className="color-swatches">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = config.color === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  className={`color-swatch-btn ${isSelected ? "selected" : ""}`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                  onClick={() => selectColor(preset.value)}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      color={preset.value === "#ffffff" ? "#000000" : "#ffffff"}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logo Upload */}
        <div className="config-section">
          <label className="config-label">Custom Logo</label>
          <div className="upload-zone" onClick={triggerUpload}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
            {config.logoUrl ? (
              <div className="logo-preview-box">
                <img src={config.logoUrl} alt="custom logo" className="logo-preview-thumbnail" />
                <span className="logo-uploaded-text">Logo loaded</span>
              </div>
            ) : (
              <>
                <Upload size={20} className="upload-icon" />
                <span>Upload SVG/PNG file</span>
              </>
            )}
          </div>
        </div>

        {/* QR Code Position */}
        <div className="config-section">
          <label className="config-label">QR Code Position</label>
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${config.qrPosition === "front" ? "active" : ""}`}
              onClick={() => selectQrPosition("front")}
            >
              Front
            </button>
            <button
              type="button"
              className={`toggle-btn ${config.qrPosition === "back" ? "active" : ""}`}
              onClick={() => selectQrPosition("back")}
            >
              Back
            </button>
            <button
              type="button"
              className={`toggle-btn ${config.qrPosition === "hidden" ? "active" : ""}`}
              onClick={() => selectQrPosition("hidden")}
            >
              Hidden
            </button>
          </div>
        </div>

        {/* Contact info */}
        <div className="config-section border-t border-gray-800/80 pt-4">
          <label className="config-label text-blue-400">Profile Screen Details</label>
          
          <div className="space-y-3 mt-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold">Email Address</label>
              <input
                type="email"
                name="email"
                value={config.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="config-input mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={config.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 890"
                className="config-input mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold">Website Link</label>
              <input
                type="text"
                name="website"
                value={config.website}
                onChange={handleInputChange}
                placeholder="example.com"
                className="config-input mt-1"
              />
            </div>
          </div>
        </div>

        {/* Socials details */}
        <div className="config-section border-t border-gray-800/80 pt-4">
          <label className="config-label text-blue-400">Social Connections</label>
          <div className="space-y-3 mt-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold">LinkedIn Slug</label>
              <input
                type="text"
                name="linkedin"
                value={config.linkedin}
                onChange={handleInputChange}
                placeholder="in/johndoe"
                className="config-input mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold">Twitter/X Slug</label>
              <input
                type="text"
                name="x"
                value={config.x}
                onChange={handleInputChange}
                placeholder="johndoe"
                className="config-input mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={config.whatsapp}
                onChange={handleInputChange}
                placeholder="+1234567890"
                className="config-input mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-semibold">Book Meeting Link</label>
              <input
                type="text"
                name="meetingLink"
                value={config.meetingLink}
                onChange={handleInputChange}
                placeholder="calendly.com/johndoe"
                className="config-input mt-1"
              />
            </div>
          </div>
        </div>

        {/* Profile Theme toggle */}
        <div className="config-section border-t border-gray-800/80 pt-4">
          <label className="config-label">Profile Page Theme</label>
          <div className="toggle-group mt-2">
            <button
              type="button"
              className={`toggle-btn ${config.profileTheme === "light" ? "active" : ""}`}
              onClick={() => selectProfileTheme("light")}
            >
              Light Profile
            </button>
            <button
              type="button"
              className={`toggle-btn ${config.profileTheme === "dark" ? "active" : ""}`}
              onClick={() => selectProfileTheme("dark")}
            >
              Dark Profile
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
