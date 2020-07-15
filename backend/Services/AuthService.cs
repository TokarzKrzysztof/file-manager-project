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


        public async Task<bool> Login(string email, string password)
        {
            bool isEmailAndPasswordCorrect = await _context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower() && x.Password == password);
            if (isEmailAndPasswordCorrect)
            {
                return true;
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

            UserModel user = UserConverter.ConvertUserViewModelToUserModel(userData);
            user.IsActive = true;
            user.CreationDate = DateTime.Now;

            await _context.AddAsync(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
