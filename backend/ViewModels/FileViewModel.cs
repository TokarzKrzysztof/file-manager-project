using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.ViewModels
{
    public class FileViewModel
    {
        public int id { get; set; }

        public string fileName { get; set; }

        public DateTime uploadTime { get; set; }

        public long size { get; set; }

        public string createdBy { get; set; }
        public string deletedBy { get; set; }
    }
}
