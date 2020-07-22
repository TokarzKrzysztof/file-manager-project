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
    public class FoldersService : IFoldersService
    {
        private readonly FileManagerDbContext _context;
        public FoldersService(FileManagerDbContext context)
        {
            _context = context;
        }

        public async Task CreateFolder(FolderViewModel folderData)
        {
            FolderModel folder = new FolderModel()
            {
                Name = folderData.name,
                ParentId = folderData.parentId,
                IsActive = true
            };

            _context.Folders.Add(folder);
            await _context.SaveChangesAsync();
        }

        public async Task<List<FolderViewModel>> GetFoldersTree()
        {
            List<FolderModel> dbFolders = await _context.Folders.Where(x => x.IsActive).ToListAsync();
            List<FolderViewModel> viewFolders = FoldersConverter.ConvertDbListToViewList(dbFolders);
            return CreateFoldersTree(viewFolders);
        }

        private List<FolderViewModel> CreateFoldersTree(List<FolderViewModel> folders)
        {
            List<FolderViewModel> foldersTree = new List<FolderViewModel>();
            foreach (FolderViewModel folder in folders)
            {
                folder.children = folders.Where(x => x.parentId == folder.id).ToList();
                if (folder.parentId == null)
                {
                    foldersTree.Add(folder);
                }
            }

            return foldersTree;
        }

        public async Task<List<FolderViewModel>> SearchForFolders(string searchString)
        {
            List<FolderModel> dbFolders =  await _context.Folders.Where(x => x.Name.ToLower().Contains(searchString.ToLower()) && x.IsActive).ToListAsync();
            return FoldersConverter.ConvertDbListToViewList(dbFolders);
        }

        public async Task SetFolderUnactive(int id)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateFolder(FolderViewModel folderData)
        {
            throw new NotImplementedException();
        }

        
    }
}
