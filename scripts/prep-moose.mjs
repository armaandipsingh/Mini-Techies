import sharp from "sharp";

const SRC =
  "/Users/armaandipsinghmaan/.cursor/projects/Users-armaandipsinghmaan-Desktop-musap-web/assets/image-50544a8c-a83d-498a-bb45-8b2e1042550d.png";

// Source is 630×863. Crop a face-centered square (bias up + slightly left
// so his face sits in the same optical center as the other headshots).
await sharp(SRC)
  .extract({ left: 10, top: 30, width: 540, height: 540 })
  .resize(600, 600, { fit: "cover" })
  .png()
  .toFile("public/team/moose.png");

const m = await sharp("public/team/moose.png").metadata();
console.log(`✓ public/team/moose.png (${m.width}x${m.height})`);
