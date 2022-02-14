using System;
using System.Collections.Generic;

namespace PromotionsApi.Business.Event.ViewModels
{
    public class EventViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<string> Platforms { get; set; }
        public string Description { get; set; }
        public bool Enabled { get; set; }
    }
}
