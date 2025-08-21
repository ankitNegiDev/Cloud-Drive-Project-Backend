import { supabase } from "../config/supabaseClient.js";


/**
 * Search items for a user:
 * - Owned items
 * - Restricted shares
 * Filters: query, type, parentId
 * Pagination: limit & offset
 */
export async function searchItemsService(userId, query, type, parentId, limit, offset) {
    try {
        // Owned items
        let ownedQuery = supabase
            .from('items')
            .select('*')
            .eq('user_id', userId)
            .ilike('name', `%${query}%`)
            .eq('is_deleted', false)
            .range(offset, offset + limit - 1);

        if (type) ownedQuery = ownedQuery.eq('type', type);
        if (parentId) ownedQuery = ownedQuery.eq('parent_id', parentId);

        const { data: ownedItems, error: ownedError } = await ownedQuery;
        if (ownedError) throw ownedError;

        // Items shared with the user (restricted)
        let sharedQuery = supabase
            .from('shares')
            .select('item_id, role, expires_at')
            .eq('shared_with', userId)
            .eq('share_type', 'restricted');

        const { data: sharedShares, error: sharedError } = await sharedQuery;
        if (sharedError) throw sharedError;

        const sharedItemIds = sharedShares.map(s => s.item_id);
        let sharedItemsData = [];
        if (sharedItemIds.length > 0) {
            let sharedItemsQuery = supabase
                .from('items')
                .select('*')
                .in('id', sharedItemIds)
                .eq('is_deleted', false);

            if (type) sharedItemsQuery = sharedItemsQuery.eq('type', type);
            if (query) sharedItemsQuery = sharedItemsQuery.ilike('name', `%${query}%`);

            const { data: sharedItems, error: itemsError } = await sharedItemsQuery;
            if (itemsError) throw itemsError;

            sharedItemsData = sharedItems.map(item => {
                const shareInfo = sharedShares.find(s => s.item_id === item.id);
                return { ...item, sharedRole: shareInfo?.role, shareExpiresAt: shareInfo?.expires_at };
            });
        }

        //  Merge and return
        return [...ownedItems, ...sharedItemsData];
    } catch (error) {
        console.log("Error in searchItemsService:", error);
        throw new Error(error.message || "Error searching items");
    }
}
