/**
 * Enterprise Pagination, Filtering, Sorting & Search Query Helper for Mongoose
 */

export const getPaginationOptions = (query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const sortField = query.sort || 'createdAt';
    const sortOrder = query.order === 'asc' || query.order === '1' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const search = query.search ? String(query.search).trim() : null;

    return {
        page,
        limit,
        skip,
        sort,
        sortField,
        sortOrder,
        search
    };
};

export const buildPaginatedResponse = ({ data, total, page, limit }) => {
    const totalPages = Math.ceil(total / limit) || 1;
    return {
        items: data,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};
