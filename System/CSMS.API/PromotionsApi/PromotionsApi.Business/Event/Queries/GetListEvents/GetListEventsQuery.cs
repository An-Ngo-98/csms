using Microsoft.EntityFrameworkCore;
using PromotionsApi.Business.Event.ViewModels;
using PromotionsApi.Common.Extentions;
using PromotionsApi.Common.Paging;
using PromotionsApi.Data.Entities;
using PromotionsApi.Data.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PromotionsApi.Business.Event.Queries.GetListEvents
{
    public class GetListEventsQuery : IGetListEventsQuery
    {
        private readonly IRepository<CsmsEvent> _eventRepository;

        public GetListEventsQuery(IRepository<CsmsEvent> eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<PagedList<EventViewModel>> ExecuteAsync(int page, int pageSize, int searchBy, string startDate, string endDate, string searchString)
        {
            try
            {
                var data = await GetDataAsync(searchBy, startDate, endDate, searchString);

                var result = page == 0 && pageSize == 0 ? data : data.Skip((page - 1) * pageSize).Take(pageSize);
                List<EventViewModel> list = new List<EventViewModel>();

                int total = 0;
                total = data.Count();
                list = result.ToList();

                return new PagedList<EventViewModel>(list, page, pageSize, total);
            }
            catch (Exception)
            {
                return new PagedList<EventViewModel>(new List<EventViewModel>(), 1, 1, 0);
            }
        }
        private async Task<IEnumerable<EventViewModel>> GetDataAsync(int? searchBy, string startDate, string endDate, string searchString)
        {
            var result = await _eventRepository.TableNoTracking
                .Select(n => new EventViewModel()
                {
                    Id = n.Id,
                    Code = n.Code,
                    Title = n.Title,
                    Description = n.Description,
                    StartDate = n.StartTime,
                    EndDate = n.EndTime,
                    Enabled = n.Enabled,
                    Platforms = n.EventDevices.Select(x => x.Device.Title).ToList()
                })
                .OrderByDescending(n => n.Id)
                .ToListAsync();

            return FilterData(result, searchBy, startDate, endDate, searchString);
        }

        private IEnumerable<EventViewModel> FilterData(List<EventViewModel> data, int? searchBy, string startDate, string endDate, string searchString)
        {
            IEnumerable<EventViewModel> query = data;

            if (searchBy.HasValue)
            {
                DateTime? _startDate = startDate.TryConvertToDateTime();
                DateTime? _endDate = endDate.TryConvertToDateTime();

                switch (searchBy)
                {
                    case (int)SearchBy.Ongoing:
                        query = query.Where(n =>
                            (n.StartDate <= DateTime.Now) &&
                            (n.EndDate != null && n.EndDate != null ? n.EndDate >= DateTime.Now : true));
                        break;

                    case (int)SearchBy.Finished:
                        query = query.Where(x => x.EndDate != null && x.EndDate < DateTime.Now);
                        break;

                    case (int)SearchBy.WillGoing:
                        query = query.Where(x => x.StartDate > DateTime.Now);
                        break;

                    case (int)SearchBy.StartDate:
                        query = query.Where(x =>
                            (_startDate != null ? _startDate <= x.StartDate &&
                            (_endDate != null ? x.StartDate <= _endDate?.Add(new TimeSpan(23, 59, 59)) : true) : true));
                        break;

                    case (int)SearchBy.EndDate:
                        query = query.Where(x =>
                            (_startDate != null ? _startDate <= x.EndDate &&
                            (_endDate != null && x.EndDate != null ? x.EndDate <= _endDate?.Add(new TimeSpan(23, 59, 59)) : true) : true));
                        break;
                }
            }

            return SearchString(query, searchString);
        }

        private IEnumerable<EventViewModel> SearchString(IEnumerable<EventViewModel> data, string searchString)
        {
            List<EventViewModel> result = data.ToList();

            if (!string.IsNullOrEmpty(searchString))
            {
                result = new List<EventViewModel>();
                char[] delimiter = { ',', ';' };
                string[] listSearch = searchString.ToLower().Split(delimiter);

                foreach (var item in listSearch)
                {
                    var value = item.ToLower().Trim();

                    var temp = data.Where(x => (x.Title.ToLower().Replace("  ", " ").Contains(value))
                       || (x.Code != null && x.Code.ToLower().Contains(value))
                       || (x.Description != null && x.Description.ToLower().Replace("  ", " ").Contains(value)));

                    result.AddRange(temp.ToList());
                }
            }

            return result.Distinct() as IEnumerable<EventViewModel>;
        }
    }

    enum SearchBy
    {
        Ongoing = 1,
        Finished = 2,
        WillGoing = 3,
        StartDate = 4,
        EndDate = 5
    }
}
