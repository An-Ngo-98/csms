using CdnApi.Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CdnApi.Data.Entities
{
    public partial class CsmsReport : ICreatedEntity, IUpdatedEntity
    {
        public int Id { get; set; }
        public string FileSize { get; set; }
        public string Filename { get; set; }
        public byte[] FileContent { get; set; }
        public string FileType { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
    }
}
