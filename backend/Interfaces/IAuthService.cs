using backend.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IAuthService
    {
        Task<bool> Register(UserViewModel userData);

        Task<bool> Login(string email, string password);
    
    }
}
