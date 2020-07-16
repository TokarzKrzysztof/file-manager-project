using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using backend.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly FileManagerDbContext _context;
        public AuthService(FileManagerDbContext context)
        {
            _context = context;
        }


        public async Task<UserViewModel> GetCurrentUser(Guid token)
        {
            UserModel user = await _context.Users.FirstOrDefaultAsync(x => x.Token == token);
            if (user != null)
            {
                return UserConverter.ConvertDbModelToViewModel(user);
            }
            else
            {
                throw new NullReferenceException();
            }

        }


        public async Task<Guid> Login(string email, string password)
        {
            UserModel user = await _context.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower() && x.Password == password);
            if (user != null)
            {
                user.IsLoggedIn = true;

                HistoryModel historyRow = new HistoryModel()
                {
                    ActionDate = DateTime.Now,
                    Description = "Użytkownik zalogował się do systemu",
                    UserData = user.Name + " " + user.Surname
                };

                _context.Users.Update(user);
                _context.History.Add(historyRow);

                await _context.SaveChangesAsync();
                return user.Token;
            }
            else
            {
                throw new InvalidOperationException("Dane logowania są nieprawidłowe");
            }
        }

        public async Task<bool> Register(UserViewModel userData)
        {
            bool isAlreadyInSystem = await _context.Users.AnyAsync(x => x.Email.ToLower() == userData.email.ToLower());
            if (isAlreadyInSystem)
            {
                throw new InvalidOperationException("Użytkownik o podanym adresie e-mail istnieje już w systemie");
            }

            if (userData.password != userData.passwordRepeat)
            {
                throw new InvalidOperationException("Hasła nie są zgodne");
            }

            UserModel user = UserConverter.ConvertViewModelToDbModel(userData);
            user.IsActive = true;
            user.IsLoggedIn = false;
            user.CreationDate = DateTime.Now;
            user.Token = Guid.NewGuid();

            HistoryModel historyRow = new HistoryModel()
            {
                ActionDate = DateTime.Now,
                Description = "Użytkownik zarejestrował się w systemie",
                UserData = user.Name + " " + user.Surname
            };

            _context.Users.Add(user);
            _context.History.Add(historyRow);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Logout(Guid token)
        {
            UserModel user = await _context.Users.FirstOrDefaultAsync(x => x.Token == token);
            if (user != null)
            {
                user.IsLoggedIn = false;

                HistoryModel historyRow = new HistoryModel()
                {
                    ActionDate = DateTime.Now,
                    Description = "Użytkownik wylogował się z systemu",
                    UserData = user.Name + " " + user.Surname
                };

                _context.Users.Update(user);
                _context.History.Add(historyRow);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                throw new NullReferenceException();
            }

        }
    }
}
