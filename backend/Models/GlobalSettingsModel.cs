using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace backend.Models
{
    public class GlobalSettingsModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int MaxSize { get; set; }
        public int LimitPerHour { get; set; }
        public int MinLength { get; set; }
        public int MinDigits { get; set; }
        public int BigLetters { get; set; }
        public int SpecialCharacters { get; set; }
    }
}
