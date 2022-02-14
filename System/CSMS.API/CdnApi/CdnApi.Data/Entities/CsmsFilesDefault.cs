using System;
using System.Collections.Generic;
using System.Text;

namespace CdnApi.Data.Entities
{
    public partial class CsmsFilesDefault
    {
        public int Id { get; set; }
        public string DefaultType { get; set; }
        public string Title { get; set; }
        public string FileSize { get; set; }
        public string Filename { get; set; }
        public byte[] FileContent { get; set; }
        public string FileType { get; set; }
        public bool Status { get; set; }
    }
}
