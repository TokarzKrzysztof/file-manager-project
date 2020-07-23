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

        public async Task<int> CreateFolder(FolderViewModel folderData)
        {
            FolderModel folder = new FolderModel()
            {
                Name = folderData.name,
                ParentId = folderData.parentId,
                IsActive = true
            };

            _context.Folders.Add(folder);
            await _context.SaveChangesAsync();

            return folder.Id;
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
            List<FolderModel> allFolders = await _context.Folders.Where(x => x.IsActive).ToListAsync();
            FolderModel folder = allFolders.FirstOrDefault(x => x.Id == id && x.IsActive);
            List<FolderModel> foldersToDelete = new List<FolderModel>();
            FindAllCorrespondingFolders(folder, allFolders, foldersToDelete);

            _context.UpdateRange(foldersToDelete);
            await _context.SaveChangesAsync();
        }

        private void FindAllCorrespondingFolders(FolderModel rootFolder, List<FolderModel> allFolders, List<FolderModel> foldersToDelete)
        {
            List<FolderModel> children = allFolders.Where(x => x.ParentId == rootFolder.Id).ToList();

            foreach(FolderModel child in children)
            {
                FindAllCorrespondingFolders(child, allFolders, foldersToDelete);
            }

            rootFolder.IsActive = false;
            foldersToDelete.Add(rootFolder);
        }

        public async Task UpdateFolder(FolderViewModel folderData)
        {
            FolderModel folder = await _context.Folders.FirstOrDefaultAsync(x => x.Id == folderData.id && x.IsActive);
            folder = FoldersConverter.UpdateDbFolderWithViewFolderData(folder, folderData);
            _context.Update(folder);
            await _context.SaveChangesAsync();
        }

        
    }
}
