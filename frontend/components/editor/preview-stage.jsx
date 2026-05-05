import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

import { AspectRatioDropdown } from "@/components/editor/aspect-ratio-dropdown";
import { Button } from "@/components/ui/button";

const ratioValueMap = {
  "2:3": 2 / 3,
  "3:2": 3 / 2,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "1:1": 1,
  "4:3": 4 / 3,
};

const fontMap = {
  "Bowlby One SC": "'Bowlby One SC', sans-serif",
  "Black Han Sans": "'Black Han Sans', sans-serif",
  Bungee: "'Bungee', sans-serif",
  Anton: "'Anton', sans-serif",
  "Archivo Black": "'Archivo Black', sans-serif",
  "Bebas Neue": "'Bebas Neue', sans-serif",
  Oswald: "'Oswald', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
  Poppins: "'Poppins', sans-serif",
  Outfit: "'Outfit', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  "League Spartan": "'League Spartan', sans-serif",
  Sora: "'Sora', sans-serif",
  Manrope: "'Manrope', sans-serif",
  Rubik: "'Rubik', sans-serif",
  "Fjalla One": "'Fjalla One', sans-serif",
  "Lilita One": "'Lilita One', sans-serif",
  Righteous: "'Righteous', sans-serif",
  Fredoka: "'Fredoka', sans-serif",
  Nunito: "'Nunito', sans-serif",
  Kalam: "'Kalam', cursive",
  "Caveat Brush": "'Caveat Brush', cursive",
  Pacifico: "'Pacifico', cursive",
  "Josefin Sans": "'Josefin Sans', sans-serif",
  "DM Serif Text": "'DM Serif Text', serif",
  Inter: "'Inter', sans-serif",
};

const sizeMap = {
  small: "text-2xl sm:text-4xl",
  medium: "text-3xl sm:text-5xl",
  large: "text-4xl sm:text-6xl",
};

const animationClassMap = {
  none: "",
  "records-wipe": "lyric-anim-records-wipe",
  "middle-scroll": "lyric-anim-middle-scroll",
  "kinetic-bounce": "lyric-anim-kinetic-bounce",
  "soft-fade-up": "lyric-anim-soft-fade-up",
  "neon-pulse": "lyric-anim-neon-pulse",
  "typewriter-glow": "lyric-anim-typewriter-glow",
  "blur-in": "lyric-anim-blur-in",
  "cinematic-zoom": "lyric-anim-cinematic-zoom",
  "wave-drift": "lyric-anim-wave-drift",
  "strobe-pop": "lyric-anim-strobe-pop",
  "smooth-rise": "lyric-anim-smooth-rise",
  "vhs-glitch": "lyric-anim-vhs-glitch",
  "shutter-reveal": "lyric-anim-shutter-reveal",
  "float-in": "lyric-anim-float-in",
  "snap-zoom": "lyric-anim-snap-zoom",
  "trail-blur": "lyric-anim-trail-blur",
  "horizon-sweep": "lyric-anim-horizon-sweep",
  "flash-cut": "lyric-anim-flash-cut",
  "micro-jitter": "lyric-anim-micro-jitter",
};

const alignmentClassMap = {
  "top-left": "items-start justify-start text-left",
  "top-center": "items-start justify-center text-center",
  "top-right": "items-start justify-end text-right",
  "center-left": "items-center justify-start text-left",
  "center-center": "items-center justify-center text-center",
  "center-right": "items-center justify-end text-right",
  "bottom-left": "items-end justify-start text-left",
  "bottom-center": "items-end justify-center text-center",
  "bottom-right": "items-end justify-end text-right",
};

function splitIntoLines(inputText, targetLines) {
  const clean = (inputText || "").trim();
  if (!clean) return "";
  const words = clean.split(/\s+/);
  if (targetLines <= 1 || words.length <= 1) return clean;

  const lines = Array.from({ length: targetLines }, () => []);
  const avg = words.length / targetLines;
  for (let i = 0; i < targetLines; i += 1) {
    const start = Math.round(i * avg);
    const end = Math.round((i + 1) * avg);
    lines[i] = words.slice(start, end);
  }

  const nonEmpty = lines.filter((line) => line.length > 0);
  return nonEmpty.map((line) => line.join(" ")).join("\n");
}

export function PreviewStage({ text, aspectRatio, setAspectRatio, mediaUrl, mediaType, appearance }) {
  const containerRef = useRef(null);
  const mediaRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const fittedSize = useMemo(() => {
    const ratio = ratioValueMap[aspectRatio] || ratioValueMap["16:9"];
    const { width: cw, height: ch } = containerSize;
    if (!cw || !ch) return { width: 0, height: 0, ratio };

    const containerRatio = cw / ch;
    if (containerRatio > ratio) {
      const height = ch;
      const width = ch * ratio;
      return { width, height, ratio };
    }
    const width = cw;
    const height = cw / ratio;
    return { width, height, ratio };
  }, [aspectRatio, containerSize]);

  function togglePlayback() {
    if (!mediaRef.current) return;
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
  }

  const previewTextValue =
    appearance?.layoutMode === "word"
      ? text.split(" ").join("\n")
      : appearance?.layoutMode === "line"
        ? splitIntoLines(text, appearance?.lineCount || 2)
        : text;
  const textClasses = sizeMap[appearance?.textSize] || sizeMap.large;
  const fontSizePx = Math.min(240, Math.max(16, Number(appearance?.fontSizePx || 0)));
  const animationClass = animationClassMap[appearance?.animation] || "";
  const alignmentClass = alignmentClassMap[appearance?.alignment] || alignmentClassMap["center-center"];
  const effectColor = appearance?.effectColor || "#f87171";
  const baseTextColor = appearance?.textColor || "#ffffff";
  const effectStyles = useMemo(() => {
    const effect = appearance?.effect || "none";
    if (effect === "none") return { textShadow: "none" };
    if (effect === "shadow") return { textShadow: `0 8px 24px ${effectColor}66` };
    if (effect === "outline") return { textShadow: `0 0 18px ${effectColor}, 0 0 36px ${effectColor}99` };
    if (effect === "soft-glow") return { textShadow: `0 0 8px ${effectColor}AA, 0 0 24px ${effectColor}55` };
    if (effect === "neon") return { textShadow: `0 0 4px ${effectColor}, 0 0 12px ${effectColor}, 0 0 24px ${effectColor}` };
    if (effect === "emboss") return { textShadow: `1px 1px 0 rgba(255,255,255,.55), -2px -2px 0 rgba(0,0,0,.45)` };
    if (effect === "raised") return { textShadow: `0 1px 0 ${effectColor}CC, 0 2px 0 ${effectColor}B3, 0 3px 0 ${effectColor}99, 0 12px 20px rgba(0,0,0,.35)` };
    if (effect === "cinematic") return { textShadow: `0 2px 0 rgba(0,0,0,.7), 0 10px 26px rgba(0,0,0,.55)` };
    if (effect === "retro") return { textShadow: `2px 2px 0 #111, 4px 4px 0 ${effectColor}CC` };
    if (effect === "ghost") return { textShadow: `0 0 14px ${effectColor}AA`, filter: "blur(.2px)" };
    if (effect === "fire") return { textShadow: `0 0 5px #ff7a18, 0 0 12px #ff4d00, 0 0 28px #ff0000` };
    if (effect === "ice") return { textShadow: `0 0 5px #67e8f9, 0 0 14px #22d3ee, 0 0 24px #0ea5e9` };
    return { textShadow: `0 8px 24px ${effectColor}66` };
  }, [appearance?.effect, effectColor]);

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col rounded-none border border-border bg-card/70">
      <div className="flex flex-1 items-center justify-center bg-muted/30 p-4 sm:p-6">
        <div ref={containerRef} className="relative h-full w-full">
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden bg-black transition-all duration-200"
            style={{
              width: `${fittedSize.width}px`,
              height: `${fittedSize.height}px`,
            }}
          >
            {mediaUrl && mediaType === "video" ? (
              <>
                <video
                  ref={mediaRef}
                  src={mediaUrl}
                  className="absolute inset-0 h-full w-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <div className="absolute inset-0 bg-black/25" />
              </>
            ) : mediaUrl && mediaType === "image" ? (
              <>
                <img src={mediaUrl} alt="Background" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_45%)]" />
            )}

            {mediaUrl && mediaType === "audio" ? (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_45%)]" />
            ) : null}

            {mediaUrl ? (
              <>
                <div className={`absolute inset-0 z-10 flex p-8 ${alignmentClass}`}>
                  <p
                    className={`max-w-5xl whitespace-pre-line font-black uppercase leading-[0.95] tracking-tight ${textClasses} ${animationClass}`}
                    style={{
                      color: baseTextColor,
                      fontFamily: fontMap[appearance?.fontFamily] || "inherit",
                      fontSize: fontSizePx || undefined,
                      ...effectStyles,
                    }}
                  >
                    {previewTextValue}
                  </p>
                </div>
                {mediaType === "audio" ? (
                  <audio
                    ref={mediaRef}
                    src={mediaUrl}
                    className="absolute bottom-3 left-3 right-3 z-20"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    controls
                  />
                ) : null}
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="absolute bottom-3 left-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black/80"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </>
            ) : (
              <div className="z-10 rounded-xl border border-dashed border-white/25 bg-black/30 px-6 py-4 text-center text-sm text-zinc-300">
                Upload audio or background video to start preview playback.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-border bg-muted/40 px-4 py-3">
        <div className="h-1.5 w-full rounded-full bg-muted">
          <div className="h-1.5 w-1/6 rounded-full bg-cyan-400" />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{mediaUrl ? "00:27" : "00:00"}</span>
          <span>{mediaUrl ? "03:54" : "00:00"}</span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <AspectRatioDropdown value={aspectRatio} onChange={setAspectRatio} />
          <Button size="sm" variant="outline" onClick={() => setAspectRatio("16:9")}>
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}
