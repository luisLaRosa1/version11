export interface IPaginateOptions {
    limit: number;
    page: number;
    pageSizeOptions: number[];
    totalDocs: number;
}

export interface IPaginationForComponent {
    length: number;
    pageIndex: number;
    pageSize: number;
    previousPageIndex?: number;
}