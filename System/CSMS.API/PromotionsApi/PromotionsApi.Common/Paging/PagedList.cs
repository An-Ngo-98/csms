using System;
using System.Collections.Generic;
using System.Linq;

namespace PromotionsApi.Common.Paging
{
    public class PagedList<T>
    {
        public PagedList(IEnumerable<T> source, int pageIndex, int pageSize, int totalCount)
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            if (pageSize < 0)
            {
                throw new ArgumentException("pageSize must be greater than zero");
            }

            TotalCount = totalCount;
            PageSize = pageSize;
            PageIndex = pageIndex;
            Items = source.ToArray();
        }

        public T[] Items { get; }
        public int PageIndex { get; }
        public int PageSize { get; }
        public int TotalCount { get; }
    }
}
