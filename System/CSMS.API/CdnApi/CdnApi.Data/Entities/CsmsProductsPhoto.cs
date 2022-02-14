using System;
using System.Collections.Generic;
using System.Text;

namespace CdnApi.Data.Entities
{
    public partial class CsmsProductsPhoto
    {
        public int Id { get; set; }
        public string FileSize { get; set; }
        public string Filename { get; set; }
        public byte[] Picture { get; set; }
        public string FileType { get; set; }
        public bool Status { get; set; }
    }
}
