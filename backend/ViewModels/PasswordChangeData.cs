using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.ViewModels
{
    public class PasswordChangeData
    {
        public string oldPassword { get; set; }
        public string newPassword { get; set; }
        public string newPasswordRepeat { get; set; }
    }
}
