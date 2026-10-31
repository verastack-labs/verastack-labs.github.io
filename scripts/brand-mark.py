"""Put the studio's mark, "By VeraStack Labs", on every image of our work the site serves, so a screenshot
or a saved image still carries the name (Rigan, 2026-10-31). Run it after adding or replacing an image:

    python scripts/brand-mark.py

Three placements, each meant to read as part of the image rather than a stamp across it:
  status  phone screens: centred in the drawn status bar, between the clock and the icons, in the
          clock's own colour, as the live prototypes do
  sheet   design system sheets: a footer band in the sheet's own ground colour
  corner  everything else: a quiet line in the bottom right corner, as the films carry "Produced by"

scripts/brand-marks.json records the hash of every marked file, so a run never marks a file twice, and
lists the images that already carry the name from their source (the Whispr and Ozer frames). The
test in src/data/brand-marks.test.ts fails when a served image is in neither list, or has changed
since it was marked. Needs Pillow and Segoe UI (Windows).
"""

import glob
import hashlib
import json
import os
import re

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, 'scripts', 'brand-marks.json')
MARK = 'By VeraStack Labs'
FONT = 'C:/Windows/Fonts/segoeuib.ttf'
SERVED = ['public/work/*/*.webp', 'public/blog/*/*.webp']
DIRECTIONS = {'tri': 'Triplicate', 'ridge': 'Ridgeline', 'haat': 'Haat', 'tiffin': 'Tiffin'}


def sha(path):
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()


def luma(rgb):
    r, g, b = (c / 255 for c in rgb[:3])
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def mean(im, box):
    px = list(im.crop(box).resize((8, 8)).get_flattened_data())
    return tuple(sum(p[i] for p in px) // len(px) for i in range(3))


def text(draw, xy, s, size, fill, anchor):
    draw.text(xy, s, font=ImageFont.truetype(FONT, size), fill=fill, anchor=anchor)


def status(im):
    # The clock sits at the left of a 390 wide screen around y 22; its colour is the pixel in that box
    # furthest from the bar's own colour.
    w, h = im.size
    k = w / 390
    bg = mean(im, (int(150 * k), int(14 * k), int(240 * k), int(30 * k)))
    box = im.crop((int(30 * k), int(14 * k), int(64 * k), int(30 * k)))
    ink = max(box.get_flattened_data(), key=lambda p: sum(abs(p[i] - bg[i]) for i in range(3)))
    layer = Image.new('RGBA', im.size, (0, 0, 0, 0))
    text(ImageDraw.Draw(layer), (w / 2, 22.5 * k), MARK, round(10.5 * k), (*ink[:3], 180), 'mm')
    return Image.alpha_composite(im, layer)


def sheet(im, name):
    w, h = im.size
    # the page colour around the sheet's rounded box, so the band reads as the page continuing
    ground = im.getpixel((1, h - 1))[:3]
    band = round(w * 0.045)
    out = Image.new('RGBA', (w, h + band), (*ground, 255))
    out.paste(im, (0, 0))
    ink = (24, 24, 28, 170) if luma(ground) > 0.55 else (245, 245, 245, 170)
    d = ImageDraw.Draw(out)
    size = round(w * 0.0125)
    text(d, (round(w * 0.025), h + band / 2), MARK, size, ink, 'lm')
    text(d, (w - round(w * 0.025), h + band / 2), f'Tokri concept, the {name} system', size, ink, 'rm')
    return out


def corner(im):
    w, h = im.size
    size = max(12, round(w * 0.0105))
    pad = max(12, round(w * 0.02))
    under = mean(im, (int(w * 0.78), int(h - pad - size * 2), w - 1, h - 1))
    ink = (24, 24, 28, 150) if luma(under) > 0.55 else (245, 245, 245, 150)
    layer = Image.new('RGBA', im.size, (0, 0, 0, 0))
    text(ImageDraw.Draw(layer), (w - pad, h - pad), MARK, size, ink, 'rs')
    return Image.alpha_composite(im, layer)


def placement(rel):
    m = re.match(r'public/work/tokri/(tri|ridge|haat|tiffin)-(\w+)\.webp$', rel)
    if m and m.group(2) == 'system':
        return lambda im: sheet(im, DIRECTIONS[m.group(1)])
    if m:
        return status
    return corner


def main():
    with open(MANIFEST, encoding='utf-8') as f:
        data = json.load(f)
    marked, at_source = data['marked'], set(data['atSource'])
    done = 0
    for pattern in SERVED:
        for path in sorted(glob.glob(os.path.join(ROOT, pattern))):
            rel = os.path.relpath(path, ROOT).replace(os.sep, '/')
            if rel in at_source or marked.get(rel) == sha(path):
                continue
            im = Image.open(path).convert('RGBA')
            placement(rel)(im).convert('RGB').save(path, 'WEBP', quality=88, method=6)
            marked[rel] = sha(path)
            done += 1
            print('marked', rel)
    data['marked'] = dict(sorted(marked.items()))
    with open(MANIFEST, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, indent=2)
        f.write('\n')
    print(done, 'marked')


if __name__ == '__main__':
    main()
