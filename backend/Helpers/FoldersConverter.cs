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
            return folders.Select(x => new FolderViewModel()
            {
                id = x.Id,
                name = x.Name,
                parentId = x.ParentId
            }).ToList();
        }

        public static FolderModel UpdateDbFolderWithViewFolderData(FolderModel dbFolder, FolderViewModel viewFolder)
        {
            dbFolder.Name = viewFolder.name;
            dbFolder.ParentId = viewFolder.parentId;

            return dbFolder;
        }
    }
}
