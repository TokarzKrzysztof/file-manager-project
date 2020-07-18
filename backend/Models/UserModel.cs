
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class UserModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }

        public string Surname { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }
        public DateTime CreationDate { get; set; }

        public Guid Token { get; set; }

        public bool IsLoggedIn { get; set; }

        public bool IsActive { get; set; }

        public bool IsAccountActivated { get; set; }
        public bool SystemAccess { get; set; }
        public bool SystemEditingEnabled { get; set; }
        public string Role { get; set; }

        public UserModel()
        {
            Id = 0;
            CreationDate = DateTime.Now;
            SystemAccess = true;
            SystemEditingEnabled = true;
            IsActive = true;
            IsLoggedIn = false;
            IsAccountActivated = false;
            Token = Guid.NewGuid();
        }
    }
}
