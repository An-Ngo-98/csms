using System;
using System.Collections.Generic;
using System.Text;

namespace CdnApi.Data.Entities
{
    public partial class CsmsUsersAvatar
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FileSize { get; set; }
        public string Filename { get; set; }
        public byte[] Picture { get; set; }
        public string FileType { get; set; }
        public string Status { get; set; }
    }
}
