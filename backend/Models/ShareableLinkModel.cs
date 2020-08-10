using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ShareableLinkModel
    {
        [Key]
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public int FileId { get; set; }
#nullable enable
        public string? FilePassword { get; set; }
    }
}
