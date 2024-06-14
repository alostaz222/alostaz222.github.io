import os
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class VideoHandler(FileSystemEventHandler):
    def __init__(self, json_file, watch_dir, url_prefix):
        self.json_file = json_file
        self.watch_dir = watch_dir
        self.url_prefix = url_prefix
        self.update_json_file()

    def on_any_event(self, event):
        if not event.is_directory:
            self.update_json_file()

    def update_json_file(self):
        video_files = [
            {"name": f, "url": os.path.join(self.url_prefix, f)}
            for f in os.listdir(self.watch_dir)
            if f.endswith(('.mp4', '.avi', '.mkv'))  # Add other video file extensions as needed
        ]
        with open(self.json_file, 'w', encoding='utf-8') as f:
            json.dump(video_files, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    watch_dir = os.path.join(base_dir, 'media/videos/others')
    json_file = os.path.join(base_dir, 'api/videos.json')
    url_prefix = 'http://alostaz222.github.io/media/videos/others'

    event_handler = VideoHandler(json_file, watch_dir, url_prefix)
    observer = Observer()
    observer.schedule(event_handler, path=watch_dir, recursive=False)
    observer.start()

    try:
        while True:
            pass  # Keep the script running
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
