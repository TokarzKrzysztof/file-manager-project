using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using backend.ViewModels;
using MailKit.Net.Smtp;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
            UserModel user = await _context.Users.FirstOrDefaultAsync(x => x.Token == token && x.IsActive);
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
            UserModel user = await _context.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower() && x.Password == password && x.IsActive);
            if (user != null)
            {
                if (user.SystemAccess == false)
                {
                    throw new InvalidOperationException("Prosimy najpierw aktywować konto!");
                }

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

        public async Task<bool> Register(UserViewModel userData, string emailActivationUrl)
        {
            bool isAlreadyInSystem = await _context.Users.AnyAsync(x => x.Email.ToLower() == userData.email.ToLower() && x.IsActive);
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
            user.SystemAccess = false;
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
            SendEmail(user, emailActivationUrl);

            await _context.SaveChangesAsync();
            return true;
        }

        private void SendEmail(UserModel user, string emailActivationUrl)
        {
            MimeMessage message = new MimeMessage();

            MailboxAddress from = new MailboxAddress("File Manager Team",
            "filemanager321@gmail.com");
            message.From.Add(from);

            MailboxAddress to = new MailboxAddress("User",
            "filemanager321@gmail.com");
            message.To.Add(to);

            message.Subject = "Rejestracja";

            BodyBuilder bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = "<h1>Witamy!</h1> " +
                "<p>Założyłeś konto w serwisie file manager, aby móc z niego korzystać należy wcześniej aktywować konto</p> " +
                $"<p>Aby to zrobić kliknij w link: {emailActivationUrl + user.Token} </p>";


            message.Body = bodyBuilder.ToMessageBody();

            using (var smtpClient = new SmtpClient())
            {
                smtpClient.Connect("smtp.gmail.com");
                smtpClient.Authenticate("filemanager321@gmail.com", "File!manager123");
                smtpClient.Send(message);
                smtpClient.Disconnect(true);
            }
        }

        public async Task<bool> Logout(Guid token)
        {
            UserModel user = await _context.Users.FirstOrDefaultAsync(x => x.Token == token && x.IsActive);
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

        public async Task ActivateAccount(Guid token)
        {
            UserModel user = await _context.Users.FirstOrDefaultAsync(x => x.Token == token && x.IsActive);
            if (user != null)
            {
                user.SystemAccess = true;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception("Nie znaleziono użytkownika");
            }

        }

        public async Task SetAccountUnactive(Guid token, string password)
        {
            UserModel user = await _context.Users.FirstOrDefaultAsync(x => x.Token == token && x.IsActive);

            if (user != null)
            {
                if (user.Password != password)
                {
                    throw new InvalidOperationException("Podane hasło jest nieprawidłowe");
                }
                user.IsActive = false;

                HistoryModel historyRow = new HistoryModel()
                {
                    ActionDate = DateTime.Now,
                    Description = "Użytkownik usunął konto",
                    UserData = user.Name + " " + user.Surname
                };

                _context.Users.Update(user);
                _context.History.Add(historyRow);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception("Nie znaleziono użytkownika");
            }
        }
    }
}
