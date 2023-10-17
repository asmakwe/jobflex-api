import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_NUMBER } from "./constant.js";

export default function paginator(page) {
  const pageNum = Math.abs(page) || DEFAULT_PAGE_NUMBER;
  const skip = (page - 1) * DEFAULT_PAGE_LIMIT;
  return {
    skip,
    limit: DEFAULT_PAGE_LIMIT,
    nextPageNum: pageNum + 1,
  };
}
