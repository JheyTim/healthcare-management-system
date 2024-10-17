const Document = require('../models/Document');

// Upload a document (Doctors and patients)
exports.uploadDocument = async (req, res) => {
  const { patientId } = req.body;

  try {
    const document = new Document({
      patient: patientId,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileUrl: `uploads/${req.file.filename}`, // Assuming local file storage
      uploadedBy: req.user._id,
    });

    await document.save();

    res
      .status(201)
      .json({ message: 'Document uploaded successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading document', error });
  }
};

// Retrieve all documents for a patient (Doctors and patients)
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      patient: req.params.patientId,
    }).populate('uploadedBy');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving documents', error });
  }
};

exports.downloadSpecificDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.download(document.fileUrl); // Send the file to the client
  } catch (error) {
    res.status(500).json({ message: 'Error downloading document', error });
  }
};
