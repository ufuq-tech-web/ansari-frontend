"use client";

import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { adminApi } from '../../lib/admin-api';

const ReactQuill = dynamic(
  () => import('react-quill-new').then((mod) => {
    const Quill = mod.Quill;
    const AlignClass = Quill.import('attributors/class/align') as any;
    AlignClass.whitelist = ['left', 'right', 'center', 'justify'];
    Quill.register(AlignClass, true);
    return mod;
  }),
  { ssr: false }
);

import 'react-quill-new/dist/quill.snow.css';

const SPINNER_SRC = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
    <circle cx="25" cy="25" r="20" fill="none" stroke="#2EC4B6" stroke-width="5" stroke-linecap="round" stroke-dasharray="90,150">
      <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite"/>
    </circle>
  </svg>`
);

export default function RichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const quillRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const editor = quillRef.current?.getEditor();
      if (!editor) return;

      const range = editor.getSelection(true);
      editor.insertEmbed(range.index, 'image', SPINNER_SRC, 'user');
      editor.formatText(range.index, 1, 'alt', 'Uploading...', 'user');
      editor.setSelection(range.index + 1);

      const findPlaceholderQuillIndex = () => {
        const imgs = Array.from(editor.root.querySelectorAll('img'));
        const img = imgs.find((el: any) => el.getAttribute('src') === SPINNER_SRC);
        if (!img) return -1;
        const blot = editor.constructor.find ? editor.constructor.find(img) : null;
        return blot ? editor.getIndex(blot) : -1;
      };

      try {
        const formData = new FormData();
        formData.append('file', file);
        const data = await adminApi.upload<{ url: string }>('/products/upload-image', formData);

        const at = findPlaceholderQuillIndex();
        if (at === -1) {
          const end = editor.getLength() - 1;
          editor.insertEmbed(end, 'image', data.url, 'user');
          editor.setSelection(end + 1);
        } else {
          editor.deleteText(at, 1, 'user');
          editor.insertEmbed(at, 'image', data.url, 'user');
          editor.setSelection(at + 1);
        }
      } catch (err) {
        const at = findPlaceholderQuillIndex();
        if (at !== -1) editor.deleteText(at, 1, 'user');
        alert('Image upload failed. Please try again.');
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
    'align', 'list', 'link', 'image', 'video'
  ];

  // Custom 4-corner resizer and native Image Dragger from Ufuq Tech
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.style.position = 'relative';

    let dragState: any = null;

    const removeControls = () => {
      container.querySelectorAll('.rte-img-controls').forEach(el => el.remove());
    };

    const positionControls = (img: HTMLImageElement, controls: HTMLDivElement) => {
      const imgRect = img.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      controls.style.top = `${imgRect.top - containerRect.top}px`;
      controls.style.left = `${imgRect.left - containerRect.left}px`;
      controls.style.width = `${imgRect.width}px`;
      controls.style.height = `${imgRect.height}px`;
    };

    const showControls = (img: HTMLImageElement) => {
      removeControls();

      const controls = document.createElement('div');
      controls.className = 'rte-img-controls';
      controls.innerHTML = `
        <button class="rte-img-delete" title="Delete image" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
        <div class="rte-img-resize-handle rte-handle-nw" data-corner="nw" title="Resize"></div>
        <div class="rte-img-resize-handle rte-handle-ne" data-corner="ne" title="Resize"></div>
        <div class="rte-img-resize-handle rte-handle-sw" data-corner="sw" title="Resize"></div>
        <div class="rte-img-resize-handle rte-handle-se" data-corner="se" title="Resize"></div>
      `;
      container.appendChild(controls);
      positionControls(img, controls);

      controls.querySelector('.rte-img-delete')?.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const editor = quillRef.current?.getEditor();
        if (!editor) return;
        const blot = editor.constructor.find ? editor.constructor.find(img) : null;
        if (blot) {
          blot.remove();
        } else {
          img.remove();
        }
        removeControls();
        onChange?.(editor.root.innerHTML);
      });

      const cornerSign: Record<string, number> = { nw: -1, ne: 1, sw: -1, se: 1 };
      controls.querySelectorAll('.rte-img-resize-handle').forEach((handle) => {
        handle.addEventListener('pointerdown', (ev: any) => {
          ev.preventDefault();
          ev.stopPropagation();
          const editorEl = container.querySelector('.ql-editor');
          if (!editorEl) return;
          dragState = {
            type: 'resize',
            img,
            controls,
            startX: ev.clientX,
            startWidthPx: img.getBoundingClientRect().width,
            editorWidth: editorEl.getBoundingClientRect().width,
            sign: cornerSign[(handle as HTMLElement).dataset.corner || 'se'],
          };
          (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
        });
      });
    };

    const handleImgPointerDown = (e: any) => {
      if (e.target.tagName !== 'IMG' || !e.target.closest('.ql-editor')) return;
      e.preventDefault(); // Stop native HTML ghost image drag
      const editorEl = container.querySelector('.ql-editor');
      if (!editorEl) return;
      dragState = {
        type: 'move-pending',
        img: e.target,
        startX: e.clientX,
        editorRect: editorEl.getBoundingClientRect(),
        moved: false,
      };
    };

    const handleClick = (e: any) => {
      if (e.target.tagName === 'IMG' && e.target.closest('.ql-editor')) {
        e.stopPropagation();
        showControls(e.target);
      } else if (!e.target.closest('.rte-img-controls')) {
        removeControls();
      }
    };

    const handlePointerMove = (e: any) => {
      if (!dragState) return;

      if (dragState.type === 'resize') {
        const { img, controls, startX, startWidthPx, editorWidth, sign } = dragState;
        const deltaX = (e.clientX - startX) * sign;
        const newWidthPx = Math.round(Math.max(60, Math.min(editorWidth, startWidthPx + deltaX)));
        img.style.width = `${newWidthPx}px`;
        dragState.finalWidthPx = newWidthPx;
        positionControls(img, controls);
        return;
      }

      if (dragState.type === 'move-pending' || dragState.type === 'move') {
        const deltaX = e.clientX - dragState.startX;
        if (!dragState.moved && Math.abs(deltaX) < 6) return; 
        if (!dragState.moved) {
          dragState.moved = true;
          dragState.type = 'move';
          removeControls(); 
          dragState.img.classList.add('rte-dragging');
        }
        dragState.lastClientX = e.clientX;
        dragState.img.style.transform = `translateX(${deltaX}px)`;
      }
    };

    const handlePointerUp = () => {
      if (!dragState) return;

      if (dragState.type === 'resize') {
        const { img, finalWidthPx } = dragState;
        dragState = null;
        if (!finalWidthPx) return;
        const editor = quillRef.current?.getEditor();
        if (!editor) return;
        const blot = editor.constructor.find ? editor.constructor.find(img) : null;
        if (blot) {
          const index = editor.getIndex(blot);
          editor.formatText(index, 1, 'width', String(finalWidthPx), 'user');
        }
        if (onChange) onChange(editor.root.innerHTML);
        return;
      }

      if (dragState.type === 'move-pending' || dragState.type === 'move') {
        const { img, editorRect, moved, lastClientX, startX } = dragState;
        dragState = null;
        img.style.transform = '';
        img.classList.remove('rte-dragging');
        if (!moved) return; 

        const editor = quillRef.current?.getEditor();
        if (!editor) return;
        const blot = editor.constructor.find ? editor.constructor.find(img) : null;
        if (!blot) return;
        const index = editor.getIndex(blot);
        const deltaDrag = lastClientX - startX;
        const currentAlign = editor.getFormat(index).align || 'center';
        
        let newAlignStr = currentAlign;
        if (deltaDrag < -30) {
           newAlignStr = currentAlign === 'right' ? 'center' : 'left';
        } else if (deltaDrag > 30) {
           newAlignStr = currentAlign === 'left' ? 'center' : 'right';
        }

        const zone = newAlignStr === 'center' ? false : newAlignStr;

        editor.formatLine(index, 1, 'align', zone, 'user');
        onChange?.(editor.root.innerHTML);
        requestAnimationFrame(() => showControls(img));
      }
    };

    container.addEventListener('click', handleClick);
    container.addEventListener('pointerdown', handleImgPointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      container.removeEventListener('click', handleClick);
      container.removeEventListener('pointerdown', handleImgPointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [onChange]);

  return (
    <div ref={containerRef} className="quill-ufuq-container" style={{ position: 'relative' }}>
      <style>{`
        .ql-editor img {
          display: block; max-width: 100%; height: auto; margin: 16px auto;
          border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.08);
          cursor: grab; transition: outline .15s ease;
          -webkit-user-drag: none;
          user-drag: none;
        }
        .ql-editor img:not([width]) { width: auto; max-width: 60%; }
        .ql-editor img:hover { outline: 3px solid rgba(59,130,246,.5); outline-offset: 2px; }
        .ql-editor img.rte-dragging { cursor: grabbing; opacity: .85; outline: 3px solid rgba(59,130,246,.5); outline-offset: 2px; }
        .ql-editor p > img { display: block; margin: 16px auto; }
        .ql-editor p > img:not([width]) { max-width: 60%; }
        .ql-editor .ql-align-center img, .ql-editor [style*="text-align: center"] img, .ql-editor [style*="text-align:center"] img { margin-left: auto; margin-right: auto; }
        .ql-editor .ql-align-left img, .ql-editor [style*="text-align: left"] img, .ql-editor [style*="text-align:left"] img { margin-left: 0; margin-right: auto; }
        .ql-editor .ql-align-right img, .ql-editor [style*="text-align: right"] img, .ql-editor [style*="text-align:right"] img { margin-left: auto; margin-right: 0; }
        
        .rte-img-controls {
          position: absolute;
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 8px;
          pointer-events: none;
          z-index: 10;
          animation: rteControlsIn .12s ease;
        }
        @keyframes rteControlsIn { from { opacity: 0; } to { opacity: 1; } }
        .rte-img-delete {
          position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: #ef4444; color: #fff; border: 2px solid #fff;
          cursor: pointer; pointer-events: auto;
          box-shadow: 0 2px 6px rgba(0,0,0,.3);
          transition: background .15s, transform .1s;
        }
        .rte-img-delete:hover { background: #dc2626; transform: translateX(-50%) scale(1.08); }
        .rte-img-resize-handle {
          position: absolute;
          width: 14px; height: 14px; border-radius: 4px;
          background: #3b82f6; border: 2px solid #fff;
          pointer-events: auto;
          box-shadow: 0 1px 4px rgba(0,0,0,.35);
        }
        .rte-img-resize-handle:hover { background: #2563eb; }
        .rte-handle-nw { top: -7px; left: -7px; cursor: nwse-resize; }
        .rte-handle-ne { top: -7px; right: -7px; cursor: nesw-resize; }
        .rte-handle-sw { bottom: -7px; left: -7px; cursor: nesw-resize; }
        .rte-handle-se { bottom: -7px; right: -7px; cursor: nwse-resize; }
      `}</style>
      <div className="bg-white rounded-xl [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-charcoal-200 [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-charcoal-200 [&_.ql-container]:min-h-[350px] [&_.ql-editor]:min-h-[350px] [&_.ql-container]:font-inter [&_.ql-editor]:text-charcoal-900 [&_.ql-editor]:overflow-y-auto">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write the body of your article here..."
        />
      </div>
    </div>
  );
}
