using System;
using System.Collections.Generic;
using System.Text;

namespace CdnApi.Business.FileDefault.ViewModels
{
    public class FileDefaultViewModel
    {
        public int Id { get; set; }
        public string DefaultType { get; set; }
        public string Title { get; set; }
        public string FileSize { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public bool Status { get; set; }
    }
}
