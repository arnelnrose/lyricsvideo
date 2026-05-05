"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Disc3, FileAudio2, Image, Music, Palette, Type, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PANELS = [
  { id: "music", label: "Music", icon: Music },
  { id: "lyrics", label: "Lyrics", icon: Type },
  { id: "templates", label: "Templates", icon: Disc3 },
  { id: "background", label: "Background", icon: Image },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function SectionHeader({ active, icon: Icon, label, onClick }) {
  return (
    <button
      className="flex w-full items-center justify-between border-b border-border px-4 py-4 text-left hover:bg-accent/40"
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-cyan-500" />
        <span className="font-semibold text-foreground">{label}</span>
      </div>
      <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${active ? "rotate-180" : ""}`} />
    </button>
  );
}

function AlignmentGlyph({ value }) {
  const [vertical, horizontal] = value.split("-");
  const verticalClass =
    vertical === "top"
      ? "items-start"
      : vertical === "center"
        ? "items-center"
        : "items-end";
  const horizontalClass =
    horizontal === "left"
      ? "items-start"
      : horizontal === "center"
        ? "items-center"
        : "items-end";

  return (
    <span className={`flex h-7 w-7 flex-col ${verticalClass} justify-center`}>
      <span className={`flex w-full flex-col gap-0.5 ${horizontalClass}`}>
        <span className="h-0.5 w-3 rounded-full bg-foreground/85" />
        <span className="h-0.5 w-2 rounded-full bg-foreground/75" />
        <span className="h-0.5 w-2.5 rounded-full bg-foreground/65" />
      </span>
    </span>
  );
}

export function RightSidebar({
  activePanel,
  setActivePanel,
  audioName,
  backgroundName,
  lyrics,
  setLyrics,
  setAudio,
  setBackgroundVideo,
  audioPreviewUrl,
  onUpload,
  uploadLoading,
  projectError,
  appearance,
  setAppearance,
  projects,
  projectsLoading,
  onStartRender,
  onRefreshProject,
}) {
  const trackName = useMemo(() => (audioName ? audioName.replace(/\.[^/.]+$/, "") : "No track loaded"), [audioName]);
  const [lyricsTab, setLyricsTab] = useState("lyrics");
  const fonts = [
    "Bowlby One SC",
    "Black Han Sans",
    "Bungee",
    "Anton",
    "Archivo Black",
    "Bebas Neue",
    "Oswald",
    "Montserrat",
    "Poppins",
    "Outfit",
    "Space Grotesk",
    "League Spartan",
    "Sora",
    "Manrope",
    "Rubik",
    "Fjalla One",
    "Lilita One",
    "Righteous",
    "Fredoka",
    "Nunito",
    "Kalam",
    "Caveat Brush",
    "Pacifico",
    "DM Serif Text",
    "Josefin Sans",
    "Inter",
  ];
  const animationOptions = [
    { value: "none", label: "No Animation" },
    { value: "records-wipe", label: "Records Wipe" },
    { value: "middle-scroll", label: "Middle Scroll" },
    { value: "kinetic-bounce", label: "Kinetic Bounce" },
    { value: "soft-fade-up", label: "Soft Fade Up" },
    { value: "neon-pulse", label: "Neon Pulse" },
    { value: "typewriter-glow", label: "Typewriter Glow" },
    { value: "blur-in", label: "Blur In" },
    { value: "cinematic-zoom", label: "Cinematic Zoom" },
    { value: "wave-drift", label: "Wave Drift" },
    { value: "strobe-pop", label: "Strobe Pop" },
    { value: "smooth-rise", label: "Smooth Rise" },
    { value: "vhs-glitch", label: "VHS Glitch" },
    { value: "shutter-reveal", label: "Shutter Reveal" },
    { value: "float-in", label: "Float In" },
    { value: "snap-zoom", label: "Snap Zoom" },
    { value: "trail-blur", label: "Trail Blur" },
    { value: "horizon-sweep", label: "Horizon Sweep" },
    { value: "flash-cut", label: "Flash Cut" },
    { value: "micro-jitter", label: "Micro Jitter" },
  ];
  const effectOptions = [
    { value: "none", label: "None" },
    { value: "shadow", label: "Shadow" },
    { value: "outline", label: "Outline" },
    { value: "soft-glow", label: "Soft Glow" },
    { value: "neon", label: "Neon" },
    { value: "emboss", label: "Emboss" },
    { value: "raised", label: "Raised 3D" },
    { value: "cinematic", label: "Cinematic Depth" },
    { value: "retro", label: "Retro Stack" },
    { value: "ghost", label: "Ghost Blur" },
    { value: "fire", label: "Fire Glow" },
    { value: "ice", label: "Ice Glow" },
  ];
  const fontOptions = fonts.map((font) => ({ value: font, label: font }));
  const alignments = [
    { value: "top-left", label: "Top Left" },
    { value: "top-center", label: "Top Center" },
    { value: "top-right", label: "Top Right" },
    { value: "center-left", label: "Center Left" },
    { value: "center-center", label: "Center" },
    { value: "center-right", label: "Center Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-center", label: "Bottom Center" },
    { value: "bottom-right", label: "Bottom Right" },
  ];
  const [backgroundTab, setBackgroundTab] = useState("video");
  const [draggingBackground, setDraggingBackground] = useState(false);

  function handleBackgroundPick(file) {
    if (!file) return;
    if (backgroundTab === "video" && !file.type.startsWith("video/")) return;
    if (backgroundTab === "image" && !file.type.startsWith("image/")) return;
    setBackgroundVideo(file);
  }

  return (
    <aside className="h-full min-h-0 w-full border-l border-border bg-card/80 lg:w-[380px]">
      <div className="h-full overflow-y-auto">
      {PANELS.map((panel) => (
        <div key={panel.id}>
          <SectionHeader
            active={activePanel === panel.id}
            icon={panel.icon}
            label={panel.label}
            onClick={() => setActivePanel(activePanel === panel.id ? "" : panel.id)}
          />
          {activePanel === panel.id ? (
            <div className="space-y-3 p-4">
              {panel.id === "music" ? (
                <>
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Playlist / Monitor</p>
                    <p className="mt-1 truncate text-sm font-semibold text-foreground">{trackName}</p>
                    <p className="text-xs text-muted-foreground">{audioName || "Upload an audio file to monitor"}</p>
                    <div className="mt-3">
                      {audioPreviewUrl ? (
                        <audio className="w-full" controls src={audioPreviewUrl} />
                      ) : (
                        <div className="rounded border border-dashed border-border p-3 text-xs text-muted-foreground">
                          Audio preview appears here after upload selection.
                        </div>
                      )}
                    </div>
                  </div>
                  <Label>Upload Audio</Label>
                  <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3">
                    <Label
                      htmlFor="audio-file"
                      className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-background px-3 py-2 transition hover:border-cyan-500/60 hover:bg-accent/40"
                    >
                      <span className="flex items-center gap-2">
                        <span className="rounded-md bg-cyan-500/10 p-1.5 text-cyan-600 dark:text-cyan-300">
                          <FileAudio2 className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-foreground">Choose audio file</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
                        <Upload className="h-3.5 w-3.5" />
                        Browse
                      </span>
                    </Label>
                    <Input
                      id="audio-file"
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => setAudio(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted-foreground">{audioName || "No file selected"}</p>
                    {audioName ? (
                      <Button size="sm" variant="outline" onClick={() => setAudio(null)}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </>
              ) : null}

              {panel.id === "lyrics" ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant={lyricsTab === "lyrics" ? "default" : "secondary"} onClick={() => setLyricsTab("lyrics")}>
                      Lyrics
                    </Button>
                    <Button variant={lyricsTab === "timings" ? "default" : "secondary"} onClick={() => setLyricsTab("timings")}>
                      Timings
                    </Button>
                  </div>
                  {lyricsTab === "lyrics" ? (
                    <>
                      <Label>Lyrics Text</Label>
                      <Textarea
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        className="min-h-44"
                        placeholder="Paste lyrics here..."
                      />
                    </>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                      Timing editor placeholder. Next: per-line timestamp controls.
                    </div>
                  )}
                </>
              ) : null}

              {panel.id === "background" ? (
                <>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <div className="mb-3 grid grid-cols-2 rounded-lg border border-border bg-background p-1">
                      <Button
                        size="sm"
                        variant={backgroundTab === "video" ? "default" : "ghost"}
                        onClick={() => setBackgroundTab("video")}
                      >
                        Video
                      </Button>
                      <Button
                        size="sm"
                        variant={backgroundTab === "image" ? "default" : "ghost"}
                        onClick={() => setBackgroundTab("image")}
                      >
                        Image
                      </Button>
                    </div>

                    <div
                      className={`rounded-xl border border-dashed p-5 text-center transition ${
                        draggingBackground ? "border-primary bg-primary/5" : "border-border bg-background/60"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDraggingBackground(true);
                      }}
                      onDragLeave={() => setDraggingBackground(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingBackground(false);
                        handleBackgroundPick(e.dataTransfer.files?.[0] || null);
                      }}
                    >
                      <p className="text-base font-semibold text-foreground">
                        {backgroundTab === "video" ? "Drop a video here" : "Drop an image here"}
                      </p>
                      <p className="my-2 text-xs font-semibold text-muted-foreground">OR</p>
                      <Label
                        htmlFor="background-file"
                        className="inline-flex cursor-pointer items-center rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
                      >
                        Browse {backgroundTab === "video" ? "Clip Library" : "Image Library"}
                      </Label>
                      <Input
                        id="background-file"
                        type="file"
                        accept={backgroundTab === "video" ? "video/*" : "image/*"}
                        className="hidden"
                        onChange={(e) => handleBackgroundPick(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted-foreground">{backgroundName || "No background selected"}</p>
                    {backgroundName ? (
                      <Button size="sm" variant="outline" onClick={() => setBackgroundVideo(null)}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </>
              ) : null}

              {panel.id === "appearance" ? (
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">Layout</p>
                    <div className="grid grid-cols-3 gap-2">
                      {["verse", "line", "word"].map((mode) => (
                        <Button
                          key={mode}
                          size="sm"
                          variant={appearance?.layoutMode === mode ? "default" : "outline"}
                          onClick={() => setAppearance({ layoutMode: mode })}
                        >
                          {mode[0].toUpperCase() + mode.slice(1)}
                        </Button>
                      ))}
                    </div>
                    {appearance?.layoutMode === "line" ? (
                      <div className="mt-3">
                        <p className="mb-2 text-xs font-semibold text-muted-foreground">Lines</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[2, 3, 4].map((lineCount) => (
                            <Button
                              key={lineCount}
                              size="sm"
                              variant={appearance?.lineCount === lineCount ? "default" : "outline"}
                              onClick={() => setAppearance({ lineCount })}
                            >
                              {lineCount} Lines
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <div className="mt-3">
                      <p className="mb-2 text-xs font-semibold text-muted-foreground">Alignment</p>
                      <div className="grid grid-cols-3 gap-2 rounded-lg border border-border/70 bg-muted/30 p-2">
                        {alignments.map((alignment) => (
                          <button
                            key={alignment.value}
                            type="button"
                            title={alignment.label}
                            aria-label={alignment.label}
                            onClick={() => setAppearance({ alignment: alignment.value })}
                            className={`flex h-10 items-center justify-center rounded-md border transition ${
                              appearance?.alignment === alignment.value
                                ? "border-primary bg-primary/15"
                                : "border-border bg-background hover:bg-accent"
                            }`}
                          >
                            <AlignmentGlyph value={alignment.value} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">Animation</p>
                    <Select value={appearance?.animation} onValueChange={(value) => setAppearance({ animation: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select animation" />
                      </SelectTrigger>
                      <SelectContent>
                        {animationOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">Size</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "small", px: 48 },
                        { key: "medium", px: 64 },
                        { key: "large", px: 80 },
                      ].map((size) => (
                        <Button
                          key={size.key}
                          size="sm"
                          variant={appearance?.textSize === size.key ? "default" : "outline"}
                          onClick={() => setAppearance({ textSize: size.key, fontSizePx: size.px })}
                        >
                          {size.key[0].toUpperCase() + size.key.slice(1)}
                        </Button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Label htmlFor="font-size-px">Font Size (px)</Label>
                      <Input
                        id="font-size-px"
                        type="number"
                        min={16}
                        max={240}
                        step={1}
                        value={appearance?.fontSizePx ?? 72}
                        onChange={(e) => {
                          const raw = Number.parseInt(e.target.value || "72", 10);
                          const next = Number.isFinite(raw) ? Math.min(240, Math.max(16, raw)) : 72;
                          setAppearance({ fontSizePx: next });
                        }}
                        className="mt-1"
                      />
                      <p className="mt-1 text-[11px] text-muted-foreground">Recommended: 40-110 for most videos.</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">Effect</p>
                    <Select value={appearance?.effect} onValueChange={(value) => setAppearance({ effect: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select effect" />
                      </SelectTrigger>
                      <SelectContent>
                        {effectOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={appearance?.textColor || "#ffffff"}
                        onChange={(e) => setAppearance({ textColor: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Effect Color</Label>
                      <Input
                        type="color"
                        value={appearance?.effectColor || "#f87171"}
                        onChange={(e) => setAppearance({ effectColor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Font</Label>
                    <Select value={appearance?.fontFamily} onValueChange={(value) => setAppearance({ fontFamily: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}

              {panel.id === "templates" ? (
                <p className="text-sm text-muted-foreground">Template preset panel ready. Next step: preset library wiring.</p>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}

      <div className="border-t border-border p-4">
        <Button className="w-full" onClick={onUpload} disabled={uploadLoading}>
          {uploadLoading ? "Uploading..." : "Upload + Save Project"}
        </Button>
        {projectError ? <p className="mt-2 text-sm text-red-400">{projectError}</p> : null}
      </div>
      <div className="border-t border-border p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Recent Projects</p>
        {projectsLoading ? <p className="text-xs text-muted-foreground">Loading projects...</p> : null}
        <div className="space-y-2">
          {(projects || []).slice(0, 4).map((project) => {
            const downloadUrl =
              project.status === "completed"
                ? `${process.env.NEXT_PUBLIC_ENGINE_BASE || "http://127.0.0.1:8000"}/projects/${project.lyricsProjectId}/download`
                : "";
            return (
              <div key={project.id} className="rounded-lg border border-border bg-muted/30 p-2">
                <p className="truncate text-xs text-muted-foreground">{project.lyricsProjectId}</p>
                <p className="text-xs text-foreground">Status: {project.status}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={() => onStartRender(project)}>
                    Start
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onRefreshProject(project)}>
                    Refresh
                  </Button>
                  {downloadUrl ? (
                    <a className="self-center text-xs text-cyan-300 underline underline-offset-4" href={downloadUrl} target="_blank">
                      Download
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </aside>
  );
}
