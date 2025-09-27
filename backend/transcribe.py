import os
import sys
import json
import requests
from faster_whisper import WhisperModel

# ----------------------------
# Download audio file from URL
# ----------------------------
def download_audio(url, filename="temp_audio.mp3"):
    try:
        response = requests.get(
            url,
            stream=True,
            timeout=60,
            allow_redirects=True,
            headers={"User-Agent": "Mozilla/5.0"}
        )
        response.raise_for_status()

        with open(filename, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        return filename
    except Exception as e:
        print(json.dumps({"error": f"Failed to download: {str(e)}"}))
        return None

# ----------------------------
# Transcription logic
# ----------------------------
def transcribe_audio(url):
    filename = download_audio(url)
    if not filename:
        return {"error": "Failed to download audio file."}

    # Load faster-whisper model
    model = WhisperModel("small", device="cpu", compute_type="int8")

    try:
        segments, info = model.transcribe(filename, language="en")
        transcript = " ".join([seg.text for seg in segments])

        result = {
            "language": info.language,
            "duration": info.duration,
            "text": transcript.strip()
        }
    except Exception as e:
        result = {"error": str(e)}

    # Clean up temp file
    if os.path.exists(filename):
        os.remove(filename)

    return result

# ----------------------------
# CLI Entry Point
# ----------------------------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No URL provided"}))
        sys.exit(1)

    url = sys.argv[1]
    result = transcribe_audio(url)
    print(json.dumps(result, indent=2, ensure_ascii=False))
