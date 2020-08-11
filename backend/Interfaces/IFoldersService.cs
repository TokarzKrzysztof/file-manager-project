using backend.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IFoldersService
    {
        Task<List<FolderViewModel>> GetFoldersTree();
        Task<int> CreateFolder(FolderViewModel folderData);
        Task SetFolderUnactive(int id);
        Task UpdateFolder(FolderViewModel folderData);
        Task<List<FolderViewModel>> SearchForFolders(string searchString);
        Task<FolderViewModel> GetFolderById(int id);
    }
}
