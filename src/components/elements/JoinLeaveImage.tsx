import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';

const applyText = (canvas: HTMLCanvasElement, text: string) => {
  const context = canvas.getContext('2d');

  let fontSize = 70;

  do {
    context!.font = `${fontSize -= 10}px NexaScript`;
  } while (context!.measureText(text).width > canvas.width - 300);

  return context!.font;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  })
}

export default component$(({ imagedata, userdata, join, ...props }: any) => {
  useVisibleTask$(async ({ track }) => {
    Object.keys(imagedata).forEach((key) => {
      track(() => imagedata[key])
    })
    const canvas = document.querySelector(`#${props.id}`)! as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const text = userdata.username || "User";

    // Reset clipping region
    ctx.restore();
    ctx.save();

    ctx.fillStyle = imagedata.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //check if imagedata.image is a url and if it is, load it
    if(imagedata.image.startsWith("http")) {
      const image = await loadImage(imagedata.image);

      ctx.drawImage(image, 0, canvas.height - 100, 100, 100);
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(image, -700, canvas.height - 200, 200, 200);
      ctx.restore();
    }

    if (imagedata.shadow == "true") {
      ctx.shadowColor = imagedata.shadowColor;
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
    }

    ctx.font = "45px NexaScript";
    ctx.fillStyle = imagedata.textColor;
    ctx.fillText(join ? "Welcome" : "Goodbye", canvas.width / 2.75, canvas.height / 2.25);
    ctx.font = applyText(canvas, text);
    ctx.fillStyle = imagedata.textColor;
    ctx.fillText(text, canvas.width / 2.75, canvas.height / 1.5);

    ctx.shadowColor = 'transparent';

    const pfp = await loadImage(`https://cdn.discordapp.com/avatars/${userdata.id}/${userdata.avatar}`);

    ctx.beginPath();
    ctx.arc(125, canvas.height / 2, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(pfp, 25, canvas.height / 2 - 100, 200, 200);

  });
  return (
    <canvas id={props.id} width={700} height={315}>
      <Slot />
    </canvas>
  );
})