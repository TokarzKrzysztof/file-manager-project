using backend.Models;
using backend.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Helpers
{
    public class UserConverter
    {
        public static UserModel ConvertViewModelToDbModel(UserViewModel userViewModel)
        {
            UserModel userDbModel = new UserModel();
            userDbModel.Id = userViewModel.id;
            userDbModel.Email = userViewModel.email;
            userDbModel.Name = userViewModel.name;
            userDbModel.Surname = userViewModel.surname;
            userDbModel.Password = userViewModel.password;
            userDbModel.Role = userViewModel.role;

            return userDbModel;
        }

        public static UserViewModel ConvertDbModelToViewModel(UserModel userModel)
        {
            UserViewModel userViewModel = new UserViewModel();
            userViewModel.id = userModel.Id;
            userViewModel.email = userModel.Email;
            userViewModel.name = userModel.Name;
            userViewModel.surname = userModel.Surname;
            userViewModel.password = userModel.Password;
            userViewModel.isLoggedIn = userModel.IsLoggedIn;
            userViewModel.token = userModel.Token;
            userViewModel.role = userModel.Role;
            userViewModel.systemAccess = userModel.SystemAccess;
            userViewModel.systemEditingEnabled = userModel.SystemEditingEnabled;

            return userViewModel;
        }

        public static List<UserViewModel> ConvertDbListToViewList(List<UserModel> users)
        {
            return users.Select(x => ConvertDbModelToViewModel(x)).ToList();
        }
    }
}
