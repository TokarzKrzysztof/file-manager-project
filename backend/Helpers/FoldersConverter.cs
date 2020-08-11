using backend.Models;
using backend.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Helpers
{
    public class FoldersConverter
    {
        public static List<FolderViewModel> ConvertDbListToViewList(List<FolderModel> folders)
        {
            return folders.Select(folder => ConvertDbModelToViewModel(folder)).ToList();
        }

        public static FolderViewModel ConvertDbModelToViewModel(FolderModel folder)
        {
            return new FolderViewModel()
            {
                id = folder.Id,
                name = folder.Name,
                parentId = folder.ParentId
            };
        }

        public static FolderModel UpdateDbFolderWithViewFolderData(FolderModel dbFolder, FolderViewModel viewFolder)
        {
            dbFolder.Name = viewFolder.name;
            dbFolder.ParentId = viewFolder.parentId;

            return dbFolder;
        }
    }
}
