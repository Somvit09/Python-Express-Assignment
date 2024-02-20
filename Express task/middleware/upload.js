const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Custom file filter logic to allow only certain file types
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG and PNG and JPG are allowed.'));
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 1024 * 1024, // 1 MB limit
  },
});

// Custom middleware to handle multer exceptions
const handleMulterExceptions = (req, res, next) => {
  upload.single('profilePicture')(req, res, (err) => {
    if (!req.file) {
      return res.status(404).json({ message: 'No file uploaded. Please upload a file.' });
    }
    if (err instanceof multer.MulterError) {
      // Multer-related errors
      return res.status(400).json({ message: 'Multer error: ' + err.message });
    } else if (err) {
      // Any other error
      return res.status(500).json({ message: 'Internal server error: ' + err.message });
    }
    next(); // Continue to the next middleware/route
  });
};

module.exports = {
  upload: upload,
  handleMulterExceptions: handleMulterExceptions,
};
