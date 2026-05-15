import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let regularFont: ArrayBuffer | null = null;
let boldFont: ArrayBuffer | null = null;

function loadFont(path: string): ArrayBuffer {
  const buf = readFileSync(path);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function getFonts(): { regular: ArrayBuffer; bold: ArrayBuffer } {
  if (!regularFont) {
    regularFont = loadFont(
      join(process.cwd(), 'node_modules/@fontsource/roboto/files/roboto-cyrillic-400-normal.woff'),
    );
  }
  if (!boldFont) {
    boldFont = loadFont(
      join(process.cwd(), 'node_modules/@fontsource/roboto/files/roboto-cyrillic-700-normal.woff'),
    );
  }
  return { regular: regularFont, bold: boldFont };
}

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]['props'];
  const { regular, bold } = getFonts();

  const svg = await satori(
    {
      type: 'div',
      key: null,
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '60px',
          fontFamily: 'Roboto',
          boxSizing: 'border-box',
        },
        children: [
          {
            type: 'div',
            key: null,
            props: {
              style: {
                fontSize: '56px',
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.2,
                maxWidth: '1000px',
              },
              children: post.data.title,
            },
          },
          {
            type: 'div',
            key: null,
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '16px' },
              children: [
                {
                  type: 'div',
                  key: null,
                  props: {
                    style: {
                      fontSize: '28px',
                      color: '#6b7280',
                      lineHeight: 1.4,
                      maxWidth: '900px',
                    },
                    children: post.data.description,
                  },
                },
                {
                  type: 'div',
                  key: null,
                  props: {
                    style: { fontSize: '22px', color: '#9ca3af', fontWeight: 400 },
                    children: 'dimino.me',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Roboto', data: regular, weight: 400, style: 'normal' },
        { name: 'Roboto', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
  });
};
