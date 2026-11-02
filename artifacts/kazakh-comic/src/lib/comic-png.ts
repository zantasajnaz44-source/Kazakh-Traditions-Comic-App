import type { TraditionComic } from '@workspace/api-client-react';

/** Export the whole story, including off-screen panels, without private answers. */
export async function createComicPng(comic: TraditionComic): Promise<Blob> {
  const image = new Image();
  image.src = `data:${comic.comicImageMimeType};base64,${comic.comicImageData}`;
  await image.decode();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable');

  const width = 1500;
  const margin = 30;
  const gap = 20;
  const cell = (width - margin * 2 - gap * 2) / 3;
  const bodyFont = '22px Arial, sans-serif';
  const lineHeight = 31;
  const textWidth = cell - 56;

  function wrap(text: string, maxWidth: number, font = bodyFont): string[] {
    ctx!.font = font;
    const lines: string[] = [];
    for (const paragraph of text.split('\n')) {
      let line = '';
      for (const word of paragraph.trim().split(/\s+/)) {
        if (ctx!.measureText(word).width > maxWidth) {
          if (line) { lines.push(line); line = ''; }
          for (const letter of Array.from(word)) {
            if (line && ctx!.measureText(line + letter).width > maxWidth) {
              lines.push(line);
              line = '';
            }
            line += letter;
          }
          continue;
        }
        const next = line ? `${line} ${word}` : word;
        if (line && ctx!.measureText(next).width > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = next;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  const titleFont = 'bold 36px Arial, sans-serif';
  const title = wrap(comic.title, width - margin * 2, titleFont);
  const panels = comic.panels.map((panel) => ({
    child: wrap(`«${panel.girlLine}»`, textWidth),
    adult: wrap(`«${panel.elderLine}»`, textWidth),
  }));
  const bubbleHeight = (lines: string[]) => 50 + lines.length * lineHeight;
  const speechHeight = Math.max(...panels.map((panel) =>
    bubbleHeight(panel.child) + bubbleHeight(panel.adult) + 48,
  ));
  const panelY = margin + title.length * 45 + 24;
  const meaningY = panelY + speechHeight + cell + 32;
  const meaning = wrap(comic.meaning, width - margin * 2);
  canvas.width = width;
  canvas.height = Math.ceil(meaningY + 48 + meaning.length * lineHeight + margin);

  ctx.fillStyle = '#faf7ef';
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.textBaseline = 'top';

  function text(lines: string[], x: number, y: number, font = bodyFont, color = '#203b3e', height = lineHeight) {
    ctx!.font = font;
    ctx!.fillStyle = color;
    lines.forEach((line, index) => ctx!.fillText(line, x, y + index * height));
  }
  function bubble(name: string, lines: string[], x: number, y: number, fill: string) {
    const height = bubbleHeight(lines);
    ctx!.fillStyle = fill;
    ctx!.strokeStyle = '#c9bfa7';
    ctx!.lineWidth = 2;
    ctx!.beginPath();
    ctx!.roundRect(x, y, cell - 28, height, 14);
    ctx!.fill();
    ctx!.stroke();
    text([name], x + 14, y + 12, 'bold 18px Arial, sans-serif', '#20766e');
    text(lines, x + 14, y + 40);
    return height;
  }

  text(title, margin, margin, titleFont, '#20766e', 45);
  panels.forEach((panel, index) => {
    const x = margin + index * (cell + gap);
    ctx.fillStyle = '#fffdf8';
    ctx.fillRect(x, panelY, cell, speechHeight + cell);
    const childHeight = bubble(comic.childName, panel.child, x + 14, panelY + 14, '#fff3dc');
    bubble(comic.elderRole, panel.adult, x + 14, panelY + childHeight + 30, '#ffffff');
    const sourceWidth = image.naturalWidth / 2;
    const sourceHeight = image.naturalHeight / 2;
    ctx.drawImage(image, index === 1 ? sourceWidth : 0, index === 2 ? sourceHeight : 0,
      sourceWidth, sourceHeight, x, panelY + speechHeight, cell, cell);
    ctx.strokeStyle = '#b8b19f';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, panelY, cell, speechHeight + cell);
  });
  text(['Дәстүрдің мәні'], margin, meaningY, 'bold 28px Arial, sans-serif', '#20766e');
  text(meaning, margin, meaningY + 44);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG export failed')), 'image/png');
  });
}
