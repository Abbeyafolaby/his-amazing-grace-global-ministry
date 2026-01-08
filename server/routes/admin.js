import express from 'express';
import Document from '../models/Document.js';
import User from '../models/User.js';
import protect from '../middleware/auth.js';
import adminProtect from '../middleware/admin.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(adminProtect);

// @route   GET /api/admin/stats
// @desc    Get admin statistics
// @access  Protected (Admin only)
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDocuments = await Document.countDocuments();

        // Calculate total storage (sum of all document sizes)
        const documents = await Document.find().select('size');
        const totalStorage = documents.reduce((acc, doc) => acc + doc.size, 0);

        res.json({
            totalUsers,
            totalDocuments,
            totalStorage
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users with their document counts
// @access  Protected (Admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        // Get document count and storage for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const userDocs = await Document.find({ uploadedBy: user._id }).select('size');
                const documentCount = userDocs.length;
                const storage = userDocs.reduce((acc, doc) => acc + doc.size, 0);

                return {
                    ...user.toObject(),
                    documentCount,
                    storage
                };
            })
        );

        res.json(usersWithStats);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// @route   DELETE /api/admin/documents/:id
// @desc    Delete a specific document
// @access  Protected (Admin only)
router.delete('/documents/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        await document.deleteOne();

        res.json({ message: 'Document deleted successfully', documentId: req.params.id });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ message: 'Server error deleting document' });
    }
});

// @route   DELETE /api/admin/documents/all
// @desc    Delete all documents
// @access  Protected (Admin only)
router.delete('/documents', async (req, res) => {
    try {
        const result = await Document.deleteMany({});

        res.json({
            message: 'All documents deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Delete all documents error:', error);
        res.status(500).json({ message: 'Server error deleting documents' });
    }
});

export default router;
