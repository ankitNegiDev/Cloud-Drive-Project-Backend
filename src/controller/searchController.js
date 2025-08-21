import { searchItemsService } from "../service/searchService.js";


// GET /api/search
export async function searchItemsController(req, res) {
    try {
        const userId = req.user.id;
        const { query = '', type, parentId, limit = 20, offset = 0 } = req.query;

        const results = await searchItemsService(userId, query, type, parentId, parseInt(limit), parseInt(offset));

        return res.status(200).json({
            success: true,
            message: 'Search results fetched successfully',
            data: results
        });
    } catch (error) {
        console.log("Error in searchItemsController: ", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}
