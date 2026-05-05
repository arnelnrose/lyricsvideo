import shutil
import subprocess
from pathlib import Path


def check_binary(name: str) -> bool:
    return shutil.which(name) is not None


def render_lyrics_video(
    *,
    project_dir: Path,
    audio_path: Path,
    background_path: Path | None,
    lyrics_path: Path,
    output_path: Path,
) -> None:
    if not check_binary("ffmpeg"):
        raise RuntimeError("FFmpeg is not installed or not available in PATH.")

    if background_path and background_path.exists():
        cmd = [
            "ffmpeg",
            "-y",
            "-i",
            str(background_path),
            "-i",
            str(audio_path),
            "-shortest",
            "-vf",
            "drawtext=textfile=lyrics.txt:fontcolor=white:fontsize=52:borderw=3:x=(w-text_w)/2:y=(h-text_h)/2:line_spacing=12",
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            str(output_path),
        ]
    else:
        cmd = [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            "color=c=black:s=1280x720:r=30",
            "-i",
            str(audio_path),
            "-shortest",
            "-vf",
            "drawtext=textfile=lyrics.txt:fontcolor=white:fontsize=52:borderw=3:x=(w-text_w)/2:y=(h-text_h)/2:line_spacing=12",
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            str(output_path),
        ]

    result = subprocess.run(
        cmd,
        cwd=str(project_dir),
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "FFmpeg render failed.")

    if not output_path.exists():
        raise RuntimeError("Render command finished but output file was not created.")

    if not lyrics_path.exists():
        raise RuntimeError("Lyrics text file is missing.")
