using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class FileModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string FileName { get; set; }

        public string FilePath { get; set; }

        public DateTime UploadTime { get; set; }

        public string ContentType { get; set; }

        public long Size { get; set; }

        public bool IsActive { get; set; }
    }
}
