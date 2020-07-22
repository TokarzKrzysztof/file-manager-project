using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.ViewModels
{
    public class FolderViewModel
    {
        public int id { get; set; }
        public string name { get; set; }
#nullable enable
        public int? parentId { get; set; }
        public List<FolderViewModel>? children { get; set; }
    }
}
