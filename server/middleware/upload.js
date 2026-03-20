const multer   = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// ── Configure Cloudinary ────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Import CloudinaryStorage with version-safe destructuring ───────────────
// multer-storage-cloudinary v4+  exports { CloudinaryStorage }
// multer-storage-cloudinary v2/3 exports the constructor directly
const cloudinaryStoragePkg = require('multer-storage-cloudinary');
const CloudinaryStorage =
  cloudinaryStoragePkg.CloudinaryStorage   // v4+ named export
  || cloudinaryStoragePkg.default          // ESM default
  || cloudinaryStoragePkg;                 // v2/v3 direct export

// ── Verify the import resolved correctly ───────────────────────────────────
// If this throws, your multer-storage-cloudinary version is unusual —
// run: npm list multer-storage-cloudinary  to check the installed version
if (typeof CloudinaryStorage !== 'function') {
  throw new Error(
    '[upload.js] CloudinaryStorage is not a constructor. ' +
    'Check your multer-storage-cloudinary version.\n' +
    'Run: npm list multer-storage-cloudinary'
  );
}

// ── Configure storage ───────────────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder;
    if (req.originalUrl.includes('profile-pic')) {
      folder = 'BidCycle/Profile';
    } else if (req.originalUrl.includes('items') || file.fieldname === 'images') {
      folder = 'BidCycle/Item_Images';
    } else {
      folder = 'BidCycle/misc';
    }
    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `${file.fieldname}-${Date.now()}`,
      // Explicitly request secure URLs (https)
      secure: true,
    };
  },
});

// ── File filter ─────────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// ── Export configured multer instance ──────────────────────────────────────
const upload = multer({
  storage,
  limits:     { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

module.exports = upload;