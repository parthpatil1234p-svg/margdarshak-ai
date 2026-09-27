import os
import subprocess
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_IMG_DIR = r"C:\Users\PARTH\.gemini\antigravity\brain\27f8a1df-2aba-4d96-82e1-b0010bd84c55"
ASSETS_DIR = r"C:\Users\PARTH\.gemini\config\skills\brag\assets"
OUTPUT_DIR = r"c:\Users\PARTH\OneDrive\Documents\hackethon\HackMatrix 5.0\MargDarshak AI\brag-output"
PUBLIC_VIDEO_DIR = r"c:\Users\PARTH\OneDrive\Documents\hackethon\HackMatrix 5.0\MargDarshak AI\public\video"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(PUBLIC_VIDEO_DIR, exist_ok=True)

BGM_PATH = os.path.join(ASSETS_DIR, "music", "happy-beats-business-moves-vol-1-by-ende-dot-app.mp3")
SFX_PATH = os.path.join(ASSETS_DIR, "sfx", "ui", "switch33.ogg")
FONT_PATH = "C\\\\:/Windows/Fonts/segoeuib.ttf"
FONT_REGULAR = "C\\\\:/Windows/Fonts/segoeui.ttf"

SCENES = [
    {
        "id": "scene1",
        "img": os.path.join(BASE_IMG_DIR, "01_hero_section.png"),
        "duration": 5.0,
        "title": "MargDarshak AI",
        "subtitle": "Beyond the JEE/NEET Binary - From Class 10 to Career",
        "badge": "HACKMATRIX 5.0 | MISC-01",
        "zoom": "min(zoom+0.0006,1.08)"
    },
    {
        "id": "scene2",
        "img": os.path.join(BASE_IMG_DIR, "14_modal_riasec_quiz.png"),
        "duration": 5.0,
        "title": "1-Click Personas & RIASEC Engine",
        "subtitle": "5-Question Psychometric Vocational Aptitude Assessment",
        "badge": "OBJECTIVE INTAKE",
        "zoom": "min(zoom+0.0006,1.08)"
    },
    {
        "id": "scene3",
        "img": os.path.join(BASE_IMG_DIR, "06_tab2_roadmap_3_tiers_comparison.png"),
        "duration": 5.0,
        "title": "3-Tier Sequential Multi-Pathway Roadmap",
        "subtitle": "Tier-1 Aspirant | Applied Industry | 100 Percent Debt-Free Polytechnic",
        "badge": "PARALLEL CAREER PATHS",
        "zoom": "min(zoom+0.0006,1.08)"
    },
    {
        "id": "scene4",
        "img": os.path.join(BASE_IMG_DIR, "08_tab3_what_if_preset_neet.png"),
        "duration": 6.0,
        "title": "Interactive What-If Contingency Simulator",
        "subtitle": "NEET Failure Pivot: +Rs 80 Lakhs & 2 Drop Years Saved",
        "badge": "KILLER USP",
        "zoom": "min(zoom+0.0006,1.08)"
    },
    {
        "id": "scene5",
        "img": os.path.join(BASE_IMG_DIR, "10_tab4_loan_roi_gauge.png"),
        "duration": 5.0,
        "title": "Financial Feasibility & Loan ROI Engine",
        "subtitle": "Debt-To-Income (DTI) Gauge & MahaDBT Scholarship Matcher",
        "badge": "FINANCIAL TRUTH",
        "zoom": "min(zoom+0.0006,1.08)"
    },
    {
        "id": "scene6",
        "img": os.path.join(BASE_IMG_DIR, "16_modal_ai_counselor_chat.png"),
        "duration": 5.0,
        "title": "Multilingual Voice AI & UN SDG Impact",
        "subtitle": "Marathi - Hindi - English | SDG 4 & SDG 8 Aligned",
        "badge": "ZERO-FAILURE AI",
        "zoom": "min(zoom+0.0006,1.08)"
    }
]

total_duration = sum(s["duration"] for s in SCENES)
print(f"Rendering {len(SCENES)} scenes, total duration = {total_duration:.1f}s")

segment_files = []

for i, scene in enumerate(SCENES):
    seg_out = os.path.join(OUTPUT_DIR, f"seg_{i}.mp4")
    segment_files.append(seg_out)
    
    title_esc = scene["title"].replace(":", "\\:").replace("'", "").replace('"', '').replace("%", "")
    subtitle_esc = scene["subtitle"].replace(":", "\\:").replace("'", "").replace('"', '').replace("%", "")
    badge_esc = scene["badge"].replace(":", "\\:").replace("'", "").replace('"', '').replace("%", "")
    
    fps = 30
    total_frames = int(scene["duration"] * fps)
    
    vf = (
        f"scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,"
        f"zoompan=z='{scene['zoom']}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={total_frames}:s=1920x1080:fps={fps},"
        f"drawbox=y=ih-170:color=black@0.75:width=iw:height=170:t=fill,"
        f"drawbox=y=ih-170:color=0x38bdf8@0.9:width=iw:height=4:t=fill,"
        f"drawtext=fontfile='scripts/font.ttf':text='{badge_esc}':fontcolor=0xf59e0b:fontsize=22:x=60:y=h-145,"
        f"drawtext=fontfile='scripts/font.ttf':text='{title_esc}':fontcolor=0xffffff:fontsize=36:x=60:y=h-115,"
        f"drawtext=fontfile='scripts/font.ttf':text='{subtitle_esc}':fontcolor=0x94a3b8:fontsize=24:x=60:y=h-68,"
        f"fade=t=in:st=0:d=0.4,fade=t=out:st={scene['duration']-0.4}:d=0.4"
    )
    
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", scene["img"],
        "-vf", vf,
        "-t", str(scene["duration"]),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "veryfast",
        "-r", "30",
        seg_out
    ]
    
    print(f"Encoding Scene {i+1}: {scene['title']}...")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"Error encoding scene {i}: {res.stderr}")
        sys.exit(1)

# Create concat list
concat_txt = os.path.join(OUTPUT_DIR, "concat_list.txt")
with open(concat_txt, "w") as f:
    for seg in segment_files:
        f.write(f"file '{os.path.basename(seg)}'\n")

# Concat video
raw_concat = os.path.join(OUTPUT_DIR, "video_raw.mp4")
subprocess.run([
    "ffmpeg", "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_txt,
    "-c", "copy",
    raw_concat
], check=True)

# Build Audio Mix (BGM + SFX hits at scene transitions)
# Scene start times:
sfx_inputs = []
sfx_filters = []
curr_time = 0.0

audio_cmd = ["ffmpeg", "-y", "-i", raw_concat, "-ss", "0", "-t", str(total_duration), "-i", BGM_PATH]

for i, scene in enumerate(SCENES):
    audio_cmd.extend(["-i", SFX_PATH])

filter_complex_parts = [
    f"[1:a]afade=t=in:st=0:d=0.8,afade=t=out:st={total_duration-1.5}:d=1.5,volume=0.32[bgm]"
]

mix_inputs = ["[bgm]"]
for i, scene in enumerate(SCENES):
    sfx_idx = i + 2
    delay_ms = int(curr_time * 1000)
    filter_complex_parts.append(f"[{sfx_idx}:a]adelay={delay_ms}|{delay_ms},volume=0.7[sfx{i}]")
    mix_inputs.append(f"[sfx{i}]")
    curr_time += scene["duration"]

filter_complex_parts.append(f"{''.join(mix_inputs)}amix=inputs={len(mix_inputs)}:duration=first:dropout_transition=2[aout]")

full_filter = ";".join(filter_complex_parts)

final_mp4 = os.path.join(OUTPUT_DIR, "margdarshak_launch.mp4")
public_mp4 = os.path.join(PUBLIC_VIDEO_DIR, "margdarshak_launch.mp4")

audio_cmd.extend([
    "-filter_complex", full_filter,
    "-map", "0:v",
    "-map", "[aout]",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    final_mp4
])

print("Mixing final video with BGM and SFX...")
res = subprocess.run(audio_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
if res.returncode != 0:
    print(f"Error mixing audio: {res.stderr}")
    sys.exit(1)

# Copy to public
import shutil
shutil.copy2(final_mp4, public_mp4)

# Extract poster frame
poster_jpg = os.path.join(OUTPUT_DIR, "margdarshak_launch.jpg")
public_poster = os.path.join(PUBLIC_VIDEO_DIR, "margdarshak_launch.jpg")
subprocess.run([
    "ffmpeg", "-y",
    "-ss", "00:00:02.500",
    "-i", final_mp4,
    "-vframes", "1",
    "-q:v", "2",
    poster_jpg
], check=True)
shutil.copy2(poster_jpg, public_poster)

print(f"✅ Master Video successfully rendered:\n -> {final_mp4}\n -> {public_mp4}\n -> Poster: {poster_jpg}")
