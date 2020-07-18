using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class HistoryModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateTime ActionDate { get; }
        public string Description { get; set; }
        public string UserData { get; set; }

        public HistoryModel()
        {
            Id = 0;
            ActionDate = DateTime.Now;
        }

    }
}
