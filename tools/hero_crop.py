"""Génère assets/img/hero-bg.jpg (fond du hero desktop) à partir de assets/img/hero-banner.jpg.

Le couloir à droite de la personne est retiré pour qu'elle se retrouve vers 80 %
de la largeur une fois l'image calée à droite (background-position: right center).

Usage :  python tools/hero_crop.py            (nécessite Pillow : pip install pillow)
Option :  python tools/hero_crop.py 0.75      (fraction de largeur conservée, 0.75 par défaut)
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img" / "hero-banner.jpg"
DST = ROOT / "assets" / "img" / "hero-bg.jpg"
KEEP = float(sys.argv[1]) if len(sys.argv) > 1 else 0.75

with Image.open(SRC) as im:
    im = im.convert("RGB")
    w, h = im.size
    im.crop((0, 0, int(w * KEEP), h)).save(DST, "JPEG", quality=90, optimize=True, progressive=True)
    print(f"{SRC.name} {w}x{h} -> {DST.name} {int(w * KEEP)}x{h}")
