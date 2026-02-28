/** Canvas-based pixel crop helper for react-easy-crop */

export interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
}

export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    outputType: 'blob' | 'dataUrl' = 'dataUrl'
): Promise<string> {
    const image = await loadImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    if (outputType === 'blob') {
        return new Promise<string>((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) { reject(new Error('Canvas is empty')); return; }
                resolve(URL.createObjectURL(blob));
            }, 'image/jpeg', 0.92);
        });
    }

    return canvas.toDataURL('image/jpeg', 0.92);
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
