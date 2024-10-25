const uploadController = (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.status(200).send({
      message: 'File uploaded successfully.',
      file: req.file.filename,
    });
  };
  
  module.exports = { uploadController };
  