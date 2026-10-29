---
name: Comic image layout
description: Why comic artwork uses fixed image crops and separately rendered dialogue.
---

Keep Kazakh dialogue in HTML speech bubbles rather than relying on the image model to spell it correctly. Generate text-free artwork.

**Why:** Exact readable Kazakh dialogue is central to this educational comic, and generated image text is unreliable.

**How to apply:** Preserve the separation between artwork and exact dialogue when revising generation or presentation. Render the HTML speech bubbles over the illustrations, never as dialogue cards below them: the user explicitly requested words on the comic.

Use a fixed square storyboard layout and display only the three intended story cells. Keep the image prompt and renderer's crop positions aligned.

**Why:** A live image generation ignored an explicit three-panel landscape instruction and returned a square four-panel grid. Fixed crops ensure the displayed comic still has exactly three panels without additional image-generation calls.

**How to apply:** Do not assume the image model will obey panel-count or landscape instructions. Any layout change must account for the renderer's cropping.
