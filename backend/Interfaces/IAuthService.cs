using backend.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IAuthService
    {
        Task<bool> Register(UserViewModel userData, string emailActivationUrl);

        Task<UserViewModel> Login(string email, string password);
        Task<bool> Logout(Guid token);
        Task<UserViewModel> GetCurrentUser(Guid token);
        Task ActivateAccount(Guid token);
        Task SetAccountUnactive(Guid token, string password);
        Task ChangePassword(Guid token, PasswordChangeData passwordChangeData);
        Task RemindPassword(string email);
        Task<List<UserViewModel>> GetAllUsers();
        Task DisableUsersSystemAccess(int[] ids);
        Task DisableUsersSystemEditing(int[] ids);
        Task UnlockUser(int id);
    }
}
