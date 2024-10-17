const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/multerMiddleware');
const {
  uploadDocument,
  getAllDocuments,
  downloadSpecificDocumentById,
} = require('../controllers/documentController');

router.post(
  '/upload',
  authMiddleware,
  roleMiddleware(['doctor', 'patient']),
  upload.single('document'),
  uploadDocument
);

router.get(
  '/:patientId',
  authMiddleware,
  roleMiddleware(['doctor', 'patient']),
  getAllDocuments
);

router.get('/download/:id', authMiddleware, downloadSpecificDocumentById);

module.exports = router;
