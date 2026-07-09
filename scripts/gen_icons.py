#!/usr/bin/env python3
"""Generate PWA icons from logo.jpg."""
import os
from PIL import Image, ImageOps

SRC = r"D:\Projects\VibeCoding\AiProjects\MusArena\musarena\public\logo.jpg"
OUT = r"D:\Projects\VibeCoding\AiProjects\MusArena\musarena\public"

def make_square(img, size):
    s = max(img.size)
    new_img = Image.new("RGB", (s, s), (0, 0, 0))
    new_img.paste(img, ((s - img.size[0]) // 2, (s - img.size[1]) // 2))
    return new_img.resize((size, size), Image.LANCZOS)

def make_maskable(img, size):
    # Maskable: safe zone 80% of icon, padding 10% on each side
    inner = int(size * 0.7)
    s = max(img.size)
    canvas = Image.new("RGB", (size, size), (0, 0, 0))
    new_img = Image.new("RGB", (s, s), (0, 0, 0))
    new_img.paste(img, ((s - img.size[0]) // 2, (s - img.size[1]) // 2))
    resized = new_img.resize((inner, inner), Image.LANCZOS)
    canvas.paste(resized, ((size - inner) // 2, (size - inner) // 2))
    return canvas

def make_monochrome(img, size, light_bg=False):
    """Make a ЧБ icon for PWA shortcut.
    On dark theme: light icon (white on black).
    On light theme: dark icon (black on white).
    """
    s = max(img.size)
    canvas_bg = (255, 255, 255) if light_bg else (0, 0, 0)
    canvas = Image.new("RGB", (size, size), canvas_bg)
    new_img = Image.new("RGB", (s, s), canvas_bg)
    new_img.paste(img, ((s - img.size[0]) // 2, (s - img.size[1]) // 2))
    # convert to grayscale, then invert if needed
    gray = new_img.convert("L")
    if light_bg:
        # Black on white
        gray = ImageOps.invert(gray)
    canvas.paste(gray.resize((size, size), Image.LANCZOS))
    return canvas

img = Image.open(SRC).convert("RGB")
print("Source:", img.size)

# Standard PWA icons
make_square(img, 192).save(os.path.join(OUT, "icon-192.png"), "PNG", optimize=True)
print("Saved icon-192.png")
make_square(img, 512).save(os.path.join(OUT, "icon-512.png"), "PNG", optimize=True)
print("Saved icon-512.png")

# Maskable (Android adaptive icon)
make_maskable(img, 512).save(os.path.join(OUT, "icon-maskable-512.png"), "PNG", optimize=True)
print("Saved icon-maskable-512.png")

# Apple touch icon
make_square(img, 180).save(os.path.join(OUT, "apple-touch-icon.png"), "PNG", optimize=True)
print("Saved apple-touch-icon.png")

# Favicon
make_square(img, 64).save(os.path.join(OUT, "favicon.png"), "PNG", optimize=True)
print("Saved favicon.png")

print("Done")
