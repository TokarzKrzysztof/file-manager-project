using backend.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using backend.Models;
using backend.ViewModels;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services
{
    public class FileService : IFileService
    {
        private readonly FileManagerDbContext _context;
        public FileService(FileManagerDbContext context)
        {
            _context = context;
        }

        public async Task DeleteFiles(int[] ids, string userData)
        {
            foreach (int fileId in ids)
            {

                FileModel file = await _context.Files.FirstOrDefaultAsync(x => x.Id == fileId);
                if (file != null)
                {
                    File.Delete(file.FilePath);

                    List<ShareableLinkModel> fileLinks = await _context.ShareableLinks.Where(x => x.FileId == file.Id).ToListAsync();
                    _context.ShareableLinks.RemoveRange(fileLinks);

                    HistoryModel historyRow = new HistoryModel()
                    {
                        Description = "USER_DELETED_FILE",
                        Param = file.FileName,
                        UserData = userData
                    };

                    _context.History.Add(historyRow);
                    _context.Files.Remove(file);
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task DeleteFiles(List<FileModel> files)
        {
            foreach (FileModel file in files)
            {
                if (file != null)
                {
                    File.Delete(file.FilePath);
                }
            }

            _context.Files.RemoveRange(files);
            await _context.SaveChangesAsync();
        }

        public async Task<FileStream> DownloadFile(int id)
        {
            FileModel file = await _context.Files.FirstOrDefaultAsync(x => x.Id == id);
            return new FileStream(file.FilePath, FileMode.Open, FileAccess.Read);
        }

        public async Task<List<FileViewModel>> GetFiles()
        {
            List<FileModel> dbFiles = await _context.Files.ToListAsync();
            return FileConverter.ConvertDbListToViewModelList(dbFiles);
        }

        public async Task<List<FileViewModel>> GetFilesInsideFolder(int folderId)
        {
            List<FileModel> dbFiles = await _context.Files.Where(x => x.FolderId == folderId).ToListAsync();
            return FileConverter.ConvertDbListToViewModelList(dbFiles);
        }

        public async Task UpdateFile(FileViewModel file)
        {
            FileModel dbFile = await _context.Files.FirstOrDefaultAsync(x => x.Id == file.id);
            dbFile = FileConverter.UpdateDbFileWithViewFileData(dbFile, file);
            _context.Files.Update(dbFile);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UploadFiles(IFormFileCollection files, string userData, int creatorId, int folderId)
        {
            string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "Files");

            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }

            int maxFilesPerHour = await _context.GlobalSettings.Select(x => x.LimitPerHour).FirstOrDefaultAsync();
            int amountUserCanUpload = await CheckAmountThatUserCanUpload(maxFilesPerHour, creatorId);

            for (int i = 0; i < files.Count; i++)
            {
                if (i == amountUserCanUpload)
                {
                    await _context.SaveChangesAsync();
                    var ex = new ApplicationException();
                    ex.Data.Add("message", "LIMIT_UPLOAD");
                    ex.Data.Add("maxFilesPerHour", maxFilesPerHour);
                    throw ex;
                }

                IFormFile file = files[i];

                string fileName = file.FileName;
                string filePath = Path.Combine(pathToSave, fileName);
                using (FileStream stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                FileModel fileToSave = new FileModel()
                {
                    FileName = fileName,
                    FilePath = filePath,
                    ContentType = file.ContentType,
                    Size = file.Length,
                    CreatedBy = userData,
                    CreatorId = creatorId,
                    FolderId = folderId
                };

                HistoryModel historyRow = new HistoryModel()
                {
                    Description = "USER_ADDED_FILE",
                    Param = fileName,
                    UserData = userData
                };

                _context.History.Add(historyRow);
                _context.Files.Add(fileToSave);
            }

            await _context.SaveChangesAsync();


            return true;
        }

        private async Task<int> CheckAmountThatUserCanUpload(int limitPerHour, int creatorId)
        {
            List<FileModel> filesAddedLastHour = await _context.Files
                .Where(x => x.CreatorId == creatorId && x.UploadTime > DateTime.Now.AddHours(-1))
                .OrderByDescending(x => x.UploadTime)
                .ToListAsync();

            if (limitPerHour > filesAddedLastHour.Count())
            {
                int canUploadAmount = limitPerHour - filesAddedLastHour.Count();
                return canUploadAmount;
            }

            return 0;
        }

        public async Task<Guid> CreateShareableLink(int fileId, string filePassword)
        {
            FileModel file = await _context.Files.FirstOrDefaultAsync(x => x.Id == fileId);

            ShareableLinkModel shareableLink = new ShareableLinkModel()
            {
                Id = Guid.NewGuid(),
                FileId = file.Id,
                FilePassword = filePassword,
                FilePath = file.FilePath
            };

            _context.ShareableLinks.Add(shareableLink);
            await _context.SaveChangesAsync();

            return shareableLink.Id;
        }

        public async Task<ShareableLinkModel> GetShareableLink(Guid linkId)
        {
            ShareableLinkModel link = await _context.ShareableLinks.FirstOrDefaultAsync(x => x.Id == linkId);
            if (link != null)
            {
                return link;
            }
            else
            {
                NullReferenceException ex = new NullReferenceException();
                ex.Data.Add("message", "FILE_NOT_FOUND_OR_DELETED");
                throw ex;
            }
        }
    }
}
