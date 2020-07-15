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
        public static UserModel ConvertUserViewModelToUserModel(UserViewModel userViewModel)
        {
            UserModel userDbModel = new UserModel();
            userDbModel.Id = userViewModel.id;
            userDbModel.Email = userViewModel.email;
            userDbModel.Name = userViewModel.name;
            userDbModel.Surname = userViewModel.surname;
            userDbModel.Password = userViewModel.password;

            return userDbModel;
        }
    }
}
