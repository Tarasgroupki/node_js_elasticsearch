const multer = require('multer');

let counter = 0;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${counter++}.${file.originalname.split('.').pop()}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

module.exports = {
  file: (name, directory, types, required = true) => (req, res, next) => {
    upload.single(name)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: 'File not uploaded',
        });
      }
      if (required) {
        return res.status(404).json({
          message: 'File is required',
        });
      }

      if (req.file) {
        req.fileUrl = `./uploads/${req.file.filename}`;
      }

      next();
    });
  },
};
