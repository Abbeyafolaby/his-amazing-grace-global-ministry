import express from 'express';
import Document from '../models/Document.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/documents/upload
// @desc    Upload a new document
// @access  Protected
router.post('/upload', protect, async (req, res) => {
    try {
        const { title, fileType, fileData, size } = req.body;

        // Validation
        if (!title || !fileType || !fileData || !size) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Create document
        const document = await Document.create({
            title,
            fileType,
            fileData,
            size,
            uploadedBy: req.user._id,
            stars: []
        });

        // Populate the uploadedBy field
        await document.populate('uploadedBy', 'username email');

        res.status(201).json(document);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

// @route   GET /api/documents
// @desc    Get all documents (shared/community view)
// @access  Protected
router.get('/', protect, async (req, res) => {
    try {
        const documents = await Document.find()
            .populate('uploadedBy', 'username email')
            .populate('stars', 'username email')
            .sort({ createdAt: -1 });

        // Add starred status for current user
        const documentsWithStarStatus = documents.map(doc => {
            const docObj = doc.toObject();
            docObj.starred = doc.stars.some(user => user._id.toString() === req.user._id.toString());
            docObj.starCount = doc.stars.length;
            return docObj;
        });

        res.json(documentsWithStarStatus);
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ message: 'Server error fetching documents' });
    }
});

// @route   GET /api/documents/my
// @desc    Get current user's documents
// @access  Protected
router.get('/my', protect, async (req, res) => {
    try {
        const documents = await Document.find({ uploadedBy: req.user._id })
            .populate('uploadedBy', 'username email')
            .populate('stars', 'username email')
            .sort({ createdAt: -1 });

        // Add starred status for current user
        const documentsWithStarStatus = documents.map(doc => {
            const docObj = doc.toObject();
            docObj.starred = doc.stars.some(user => user._id.toString() === req.user._id.toString());
            docObj.starCount = doc.stars.length;
            return docObj;
        });

        res.json(documentsWithStarStatus);
    } catch (error) {
        console.error('Get my documents error:', error);
        res.status(500).json({ message: 'Server error fetching your documents' });
    }
});

// @route   PUT /api/documents/:id/star
// @desc    Toggle star status for a document
// @access  Protected
router.put('/:id/star', protect, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check if user already starred this document
        const starIndex = document.stars.indexOf(req.user._id);

        if (starIndex > -1) {
            // Remove star
            document.stars.splice(starIndex, 1);
        } else {
            // Add star
            document.stars.push(req.user._id);
        }

        await document.save();
        await document.populate('uploadedBy', 'username email');
        await document.populate('stars', 'username email');

        const docObj = document.toObject();
        docObj.starred = document.stars.some(user => user._id.toString() === req.user._id.toString());
        docObj.starCount = document.stars.length;

        res.json(docObj);
    } catch (error) {
        console.error('Star toggle error:', error);
        res.status(500).json({ message: 'Server error toggling star' });
    }
});

export default router;
