module.exports = {
    paginateOptions: (req) => {
        const perPage = req.query?.perPage ?? 20;
        const page = req.query?.page ?? 1;
        const myCustomLabels = {
            totalDocs: 'total',
            docs: 'data',
            limit: 'perPage',
            page: 'currentPage',
            nextPage: 'next',
            prevPage: 'prev',
            totalPages: 'pageCount',
            pagingCounter: 'slNo',
            meta: 'paginator',
        };

        for (const i in req.query) {
            if (Object.hasOwnProperty.call(req.query, i)) {
                req.query[i] = {
                    $regex: req.query[i]
                };
            }
        }
        return {
            filter: req.query,
            options: {
                page: page,
                limit: perPage,
                customLabels: myCustomLabels,
            }
        }
    }
}