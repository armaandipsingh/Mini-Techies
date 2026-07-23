import sharp from "sharp";

const SRC =
  "/Users/armaandipsinghmaan/.cursor/projects/Users-armaandipsinghmaan-Desktop-musap-web/assets/image-50544a8c-a83d-498a-bb45-8b2e1042550d.png";

// Source is 630x863 portrait; crop a face-centered square.
await sharp(SRC)
  .extract({ left: 35, top: 55, width: 560, height: 560 })
  .resize(600, 600, { fit: "cover" })
  .png()
  .toFile("public/team/moose.png");

const m = await sharp("public/team/moose.png").metadata();
console.log(`✓ public/team/moose.png (${m.width}x${m.height})`);
