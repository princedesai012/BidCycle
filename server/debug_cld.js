const pkg = require('multer-storage-cloudinary');
console.log('Type of pkg:', typeof pkg);
console.log('Keys:', Object.keys(pkg));
console.log('pkg:', pkg);
if (pkg.CloudinaryStorage) {
    console.log('CloudinaryStorage type:', typeof pkg.CloudinaryStorage);
}
try {
    const { CloudinaryStorage } = pkg;
    new CloudinaryStorage();
} catch (e) {
    console.log('Constructor error:', e.message);
}
